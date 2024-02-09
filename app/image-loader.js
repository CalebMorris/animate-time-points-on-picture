function setupImageDropHandler($dropZone, fileDroppedCallback) {
    $dropZone.ondrop = dropHandler.bind(null, fileDroppedCallback);
    $dropZone.ondragenter = dragEnter;
    $dropZone.ondragleave = dragLeave;
    $dropZone.ondragover = dragOverHandler;
}

function dropHandler(fileDroppedCallback, event) {
    event.preventDefault();
    const files = [...event.dataTransfer.items]
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
    if (files.length) {
        fileDroppedCallback(files[0])
    }
}

function dragEnter(event) {
    event.preventDefault();
    document.getElementById('image-drop-icon').classList.add('fa-rotate-by')
    document.getElementById('image-drop-zone').classList.remove('image-drop-zone-non-dragging')
    document.getElementById('image-drop-zone').classList.add('image-drop-zone-dragging')
}

function dragLeave(event) {
    event.preventDefault();
    document.getElementById('image-drop-icon').classList.remove('fa-rotate-by')
    document.getElementById('image-drop-zone').classList.add('image-drop-zone-non-dragging')
    document.getElementById('image-drop-zone').classList.remove('image-drop-zone-dragging')
}

function dragOverHandler(ev) {
    ev.preventDefault();
}