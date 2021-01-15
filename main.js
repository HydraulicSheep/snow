import * as BasicShaders from  './shaders/basic_shaders.js'
import * as BuildTools from  './utils/buildProgram.js'
import {Circle} from './shapes/circle.js'
import * as MatrixOps from './utils/2dmatrixops.js'

const MAX_PARTICLES = 100


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

    // Create initial snow particles
    var particles = []

    for (var i=0;i<MAX_PARTICLES;i++) {
        
        var circle = addSnow(gl);
        particles.push(circle);
    }

    // Get Locations of Variables
    var locOfposAttrb = gl.getAttribLocation(program, "pos");
    var matrixLocation = gl.getUniformLocation(program, "transformation_matrix");
    


    tick();

    function tick() {

        updateParticles();
        renderFrame();

        function updateParticles() {
            var newParticles = []
            for (var particle of particles) {
                if (particle.y + particle.radius >= -1) {
                    newParticles.push(particle);
                    particle.y -= 0.002;
                    particle.x += (Math.random()-0.5)*0.001
                } else {
                    var circle = addSnow(gl);
                    circle.y = 1.001 + circle.radius;
                    newParticles.push(circle)
                }
                
            }
            particles = newParticles

        }

        function renderFrame() {

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas to black
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            for (var particle of particles) {
            
                
                gl.enableVertexAttribArray(locOfposAttrb);
        
                // Bind the position buffer.
                gl.bindBuffer(gl.ARRAY_BUFFER, particle.posBuffer);
                
                // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
                var size = 2;          // 2 components per iteration
                var type = gl.FLOAT;   // the data is 32bit floats
                var normalize = false; // don't normalize the data
                var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                var offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    locOfposAttrb, size, type, normalize, stride, offset)

                var matrix = MatrixOps.translation(particle.x,particle.y);
                gl.uniformMatrix3fv(matrixLocation, false, matrix);
        
                var primitiveType = gl.TRIANGLES;
                var offset = 0;
                var count = 10*3;
                gl.drawArrays(primitiveType, offset, count);
    
            }
            window.requestAnimationFrame(tick);
        }


    }

    

}

function addSnow(gl) {

    var randx = (Math.random()-0.5)*2;
    var randy = (Math.random()-0.5)*2;
    var circle = new Circle(0.005,randx, randy);
    

    var vertices = circle.getVertices(10);
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    circle.posBuffer = posBuffer;
    return circle;
}


window.onload = init;