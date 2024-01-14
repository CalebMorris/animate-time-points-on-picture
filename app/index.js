const blobURLSupport = ((ref2 = window.URL) != null ? ref2.createObjectURL : void 0) != null;

function importImageToCanvas(canvas, ctx, e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
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
    newRow.innerHTML = '<label>Position X</label><input type="number" class="point-pos-x"></input><label>Position Y</label><input type="number" class="point-pos-y"></input>'
    document
        .getElementById('point-inputs')
        .append(newRow)
}

function drawRedSquare(ctx) {
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 75, 50); //draw a little red box
}

function drawBlueCircle(ctx) {
    ctx.fillStyle = "rgb(0,200,0)";
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function render(canvas, ctx) {
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

    gif.addFrame(ctx, { copy: true });

    drawRedSquare(ctx);
    gif.addFrame(ctx, { copy: true });

    drawBlueCircle(ctx);
    gif.addFrame(ctx, { copy: true, delay: 200 });

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