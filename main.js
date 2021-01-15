import * as BasicShaders from  './shaders/basic_shaders.js'
import * as BuildTools from  './utils/buildProgram.js'


function init() {

    const canvas = document.getElementById("mainCanvas");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        alert('Failed to get WebGL Context. Your browser/machine may block or not support WebGL.');
        return;
    }

    main(canvas, gl);

}

function main(canvas, gl) {

    // Builds a program using some basic shaders
    var program = BuildTools.buildProgram(gl, BasicShaders.vertex_shader, BasicShaders.fragment_shader);

    if (program === null) {
        console.log('Execution Halted due to failed program build');
        return;
    }

    var locOfposAttrb = gl.getAttribLocation(program, "pos");
    
    
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);



}


window.onload = init;