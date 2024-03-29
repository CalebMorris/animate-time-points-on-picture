const blobURLSupport = ((ref2 = window.URL) != null ? ref2.createObjectURL : void 0) != null;

var baseImage
var isControlling = false
var $control
var startingMousePosition
var startingPointPosition
var ctx

function importImageToCanvas(canvas, ctx, e) {
    importImageFileToCanvas(canvas, ctx, e.target.files[0]);
}

function importImageFileToCanvas(canvas, ctx, imageFile) {
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
        document.getElementById('file-input').style.display = 'none'
        enableInputPoints();
    }
    reader.readAsDataURL(imageFile);
}

function enableInputPoints() {
    addPointInputRow();
    [...document.getElementsByClassName('hidden-before-image')].forEach(element => element.classList.remove('hidden-before-image'))
}

function createPointInput(xOrY) {
    const $pointInput = document.createElement('input')
    $pointInput.type = 'number'
    $pointInput.className = `point-pos-${xOrY}`
    $pointInput.placeholder = '0'
    return $pointInput
}

function createLabel(message, mut) {
    const $label = document.createElement('label')
    $label.innerText = message
    if (mut) {
        return mut($label)
    } else {
        return $label
    }
}

function openTab(tabName) {
    var allTabItems = [...document.getElementsByClassName("tab-item")];
    allTabItems.forEach(tabItem => {
        tabItem.classList.add('tab-item-unselected')
        tabItem.classList.remove('tab-item-selected')
    })
    var allTabContentItems = [...document.getElementsByClassName("tab-content")];
    allTabContentItems.forEach(tabContentItem => {
        tabContentItem.classList.add('tab-non-visible')
        tabContentItem.classList.remove('tab-visible')
    })
    var allSelectingElements = [...document.querySelectorAll(`[data-tab=${tabName}]`)];
    allSelectingElements.forEach(selectingItem => {
        if (selectingItem.classList.contains('tab-item')) {
            selectingItem.classList.remove('tab-item-unselected')
            selectingItem.classList.add('tab-item-selected')
        } else if (selectingItem.classList.contains('tab-content')) {
            selectingItem.classList.remove('tab-non-visible')
            selectingItem.classList.add('tab-visible')
        }
    })
}

let inputRowCount = 1;

function addPointInputRow() {
    const $previewControlButton = document.createElement("button");
    $previewControlButton.style.minHeight = '16px';
    $previewControlButton.style.minWidth = '16px';
    $previewControlButton.style.cursor = 'grab'
    const $previewControl = document.createElement("i");
    $previewControl.className = 'fa-solid fa-bullseye point-preview-control'
    $previewControlButton.append($previewControl)

    const $removeRowButton = document.createElement('button')
    $removeRowButton.className = 'remove-row-button'
    $removeRowButton.style.minHeight = '16px';
    $removeRowButton.style.minWidth = '16px';
    $removeRowButton.innerHTML = '<i class="fa-solid fa-x"></i>'

    const inputRowElements = [
        createLabel(`${inputRowCount} `, function($element) {
            $element.classList.add('input-row-position')
            return $element;
        }),
        $previewControlButton,
        createLabel('Position X'),
        createPointInput('x'),
        createLabel('Position Y'),
        createPointInput('y'),
        $removeRowButton,
    ]

    const newRow = document.createElement("div");
    newRow.className = 'graph-display-point'
    newRow.append(...inputRowElements)
    document
        .getElementById('point-inputs')
        .append(newRow)
    inputRowCount += 1;

    $previewControlButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
        const currentPoint = getPoint(newRow)
        isControlling = true;
        $control = $previewControlButton;
        startingMousePosition = [event.clientX, event.clientY]
        startingPointPosition = currentPoint
        drawPoint(ctx, currentPoint)
        console.log('startingPointPosition', startingPointPosition)
        renderAllPointsToCanvase(ctx)
    });
    $removeRowButton.addEventListener('click', (event) => {
        $removeRowButton.parentElement.remove();
        inputRowCount -= 1;
        [...document.getElementsByClassName('input-row-position')].reduce((acc, $inputRowPosition) => {
            $inputRowPosition.textContent = `${acc} `
            return acc + 1
        }, 1)
        renderAllPointsToCanvase(ctx)
    })
}

function clearToBaseImage(ctx) {
    ctx.drawImage(baseImage, 0, 0);
}

function drawPoint(ctx, position, withoutClear) {
    if (!withoutClear) { clearToBaseImage(ctx) }
    ctx.fillStyle = "rgb(0,0,200,0.5)";
    ctx.beginPath();
    ctx.arc(position[0], position[1], 10, 0, 2 * Math.PI);
    ctx.fill();
}

function renderAllPointsToCanvase(ctx) {
    document.getElementById('canvas-container').style.display = null
    const pointsToRender = getPoints()
    clearToBaseImage(ctx)
    pointsToRender.forEach(point => {
        drawPoint(ctx, point, true);
    });
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
        $renderimg.src = URL.createObjectURL(blob);
    });

    gif.render();

    const $imageRenderContainer = document.getElementById('render-image-container');
    unhideRender($imageRenderContainer)
    openTab('view')
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
    ctx = canvas.getContext("2d");

    const $imageLoader = document.getElementById('imageLoader');
    $imageLoader.addEventListener('change', importImageToCanvas.bind(null, canvas, ctx), false);

    const $renderImageButton = document.getElementById('render-gif-button');
    $renderImageButton.addEventListener('click', render.bind(null, canvas, ctx));
    [...document.querySelectorAll(`[data-tab=view].tab-item-unselected`)].forEach(($element) => {
        $element.addEventListener('click', render.bind(null, canvas, ctx))
    })

    const $addPointButton = document.getElementById('add-another-point-button')
    $addPointButton.addEventListener('click', addPointInputRow)

    // Preview Controll Setup
    addEventListener("mouseup", (event) => {
        if (isControlling) {
            event.preventDefault();
            $control = undefined
            isControlling = false;
            startingMousePosition = undefined;
            startingPointPosition = undefined;
        }
    });
    addEventListener("mousemove", (event) => {
        if (isControlling) {
            event.preventDefault();
            const offset = [startingMousePosition[0] - event.clientX, startingMousePosition[1] - event.clientY]
            const newPointPosition = [startingPointPosition[0] - offset[0], startingPointPosition[1] - offset[1]]

            $control.parentElement.getElementsByClassName('point-pos-x')[0].value = newPointPosition[0]
            $control.parentElement.getElementsByClassName('point-pos-y')[0].value = newPointPosition[1]
            renderAllPointsToCanvase(ctx)
        }
    });

    setupImageDropHandler(document.getElementById('image-drop-zone'), (file) => {
        console.log(`File dropped: ${file.name}`)
        importImageFileToCanvas(canvas, ctx, file)
    })

});