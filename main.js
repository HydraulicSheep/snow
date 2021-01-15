
function init() {

    const canvas = document.getElementById("mainCanvas");
    const gl = canvas.getContext("gl");

    if (gl === null) {
        alert('Failed to get WebGL Context. Your browser/machine may block or not support WebGL.');
        return;
    }


}


window.onload = init;