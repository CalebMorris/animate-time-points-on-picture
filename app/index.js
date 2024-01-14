const blobURLSupport = ((ref2 = window.URL) != null ? ref2.createObjectURL : void 0) != null;

var baseImage

function importImageToCanvas(canvas, ctx, e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        baseImage = new Image();
        baseImage.onload = function () {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.drawImage(baseImage, 0, 0);
        }
        baseImage.src = event.target.result;
        document.getElementById('canvas-container').style.display = null
        enableInputPoints();
    }
    reader.readAsDataURL(e.target.files[0]);
}

function enableInputPoints() {
    addPointInputRow();
    document.getElementById('point-inputs').style.display = null
    document.getElementById('render-gif-button').style.display = null
}

function addPointInputRow() {
    const newRow = document.createElement("div");
    newRow.className = 'graph-display-point'
    newRow.innerHTML = '<label>Position X</label><input type="number" class="point-pos-x" placeholder="0"></input><label>Position Y</label><input type="number" class="point-pos-y" placeholder="0"></input>'
    document
        .getElementById('point-inputs')
        .append(newRow)
}

function drawPoint(ctx, position) {
    ctx.drawImage(baseImage, 0, 0);
    ctx.fillStyle = "rgb(0,0,200,0.5)";
    ctx.beginPath();
    ctx.arc(position[0], position[1], 10, 0, 2 * Math.PI);
    ctx.fill();
}

function render(canvas, ctx) {
    const pointsToRender = getPoints()
    console.log('pointsToRender', pointsToRender)

    var $renderimg = document.getElementById('render')
    $renderimg.width = canvas.width
    $renderimg.height = canvas.height
    var gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        background: '#ffffff',
    });

    gif.addFrame(baseImage)

    pointsToRender.forEach(point => {
        drawPoint(ctx, point);
        gif.addFrame(ctx, { copy: true, delay: 200 });
    });

    gif.on("finished", function (blob) {
        document.getElementById('canvas-container').style.display = 'none'
        $renderimg.src = URL.createObjectURL(blob);
    });

    gif.render();

    const $imageRenderContainer = document.getElementById('render-image-container');
    unhideRender($imageRenderContainer)
}

function unhideRender($imageRenderContainer) {
    $imageRenderContainer.style.display = null
}

function getPoints() {
    return Array.prototype.slice
        .call(document.getElementsByClassName('graph-display-point'))
        .map(getPoint)
        .filter(x => !!x)
}

function getPoint($pointRow) {
    try {
        return [
            +($pointRow.getElementsByClassName('point-pos-x')[0].value),
            +($pointRow.getElementsByClassName('point-pos-y')[0].value),
        ];
    } catch (e) {
        return []
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    const canvas = document.getElementById("bitmap");
    const ctx = canvas.getContext("2d");

    const $imageLoader = document.getElementById('imageLoader');
    $imageLoader.addEventListener('change', importImageToCanvas.bind(null, canvas, ctx), false);

    const $renderImageButton = document.getElementById('render-gif-button')
    $renderImageButton.addEventListener('click', render.bind(null, canvas, ctx))

    const $addPointButton = document.getElementById('add-another-point-button')
    $addPointButton.addEventListener('click', addPointInputRow)
});