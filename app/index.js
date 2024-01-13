const blobURLSupport = ((ref2 = window.URL) != null ? ref2.createObjectURL : void 0) != null;

function drawRedSquare(context) {
    // context.fillStyle = "rgb(255,255,255)";
    // context.fillRect(0, 0, canvas.width, canvas.height); //GIF can't do transparent so do white
    // context.fillRect(0, 0, 400, 400); //GIF can't do transparent so do white

    context.fillStyle = "rgb(200,0,0)";
    context.fillRect(10, 10, 75, 50); //draw a little red box
}

function drawBlueCircle(context) {
    // context.fillStyle = "rgb(255,255,255)";
    // context.fillRect(0, 0, 400, 400); //GIF can't do transparent so do white

    context.fillStyle = "rgb(0,200,0)";
    // context.fillRect(10, 10, 75, 50); //draw a little red box
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.fillStyle = "blue";
    context.fill();
}

function main(context) {
    console.log('rendering')
    var $renderimg = document.body.querySelectorAll('img.render')[0];
    var gif = new GIF({
        workers: 2,
        quality: 10,
        width: 400,
        height: 400,
        background: '#ffffff',
    });

    // add a image element
    //   gif.addFrame(imageElement);

    // or a canvas element
    //   gif.addFrame(canvasElement, { delay: 200 });

    // or copy the pixels from a canvas context
    //   gif.addFrame(ctx, { copy: true });
    drawRedSquare(context);
    gif.addFrame(context, {copy: true});

    drawBlueCircle(context);
    gif.addFrame(context, { copy:true, delay: 200 });

    gif.on("finished", function (blob) {
        $renderimg.src = URL.createObjectURL(blob);
    });

    gif.render();
}

document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById("bitmap");
    var context = canvas.getContext("2d");

    // drawBlueCircle(context);
    // drawRedSquare(context);
    main(context);
});