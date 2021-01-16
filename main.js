import * as BasicShaders from  './shaders/basic_shaders.js'
import * as BuildTools from  './utils/buildProgram.js'
import {Circle} from './shapes/circle.js'
import * as MatrixOps from './utils/2dmatrixops.js'
import {getCanvasMousePos} from './utils/clickutils.js'

const MAX_PARTICLES = 1000
const SIDES_PER_CIRCLE = 10;


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

    // Get Locations of Variables in the linked program.
    var locOfposAttrb = gl.getAttribLocation(program, "pos");
    var matrixloc = gl.getUniformLocation(program, "transformation_matrix");
    var colourloc = gl.getUniformLocation(program, "colour");

    tick();

    function tick() {

        updateParticles();
        renderFrame();

        function updateParticles() {
            var newParticles = []

            for (var particle of particles) {

                // Checks whether the particle should be culled.
                if (particle.y + particle.radius >= -1) {
                    
                    newParticles.push(particle);

                    // Does vertical movement and adds downward acceleration.
                    particle.y += particle.v;
                    particle.v -= 0.00001;

                    // Calculations to stop too much movement in any direction.
                    // Adds some random deviations to simulate eddy currents.
                    if (particle.v > 0) {
                        particle.v -= 0.01;
                        particle.vh += (Math.random()-0.5)*0.0001;
                    }

                    if (particle.v < -0.01) {
                        particle.v += 0.001;
                        particle.vh += (Math.random()-0.5)*0.0001;
                    }

                    if (particle.vh > 0.01) {
                        particle.vh -= 0.01;
                    }

                    if (particle.vh < 0.01) {
                        particle.vh += 0.01;
                    }
                    

                    // Handles click mechanics. Any particle within a circle of radius 0.0625 will be repelled.
                    if (mouseDown && (Math.pow(particle.x-mouseX,2) + Math.pow(particle.y-mouseY,2) < 0.0625)) {

                        // Calculates a displacement vector towards the edge of the circle.
                        var diffVec = [particle.x-mouseX,particle.y-mouseY];
                        var mag = Math.sqrt(Math.pow(diffVec[0],2)+Math.pow(diffVec[1],2));
                        diffVec = [diffVec[0]*0.25/mag,diffVec[1]*0.25/mag];

                        // Partially displaces the particles and gives them a 'scattering velocity'.
                        particle.x += diffVec[0]*0.1;
                        particle.hv += (Math.random()+0.5)*0.01*diffVec[0];
                        particle.y += diffVec[1]*0.1;
                        particle.v += (Math.random()+0.5)*0.01*diffVec[1];

                    }


                    // Adds horizontal velocity to particle
                    particle.hv += Math.random()*0.00001*(particle.direction-0.5)*2;
                    particle.x += particle.hv
                    
                } else {
                    // If a particle is culled, a new one is added in its place
                    var circle = addSnow(gl);
                    circle.y = 1.001 + circle.radius;
                    newParticles.push(circle)
                }

                // 1/10 chance of switching the drift direction.
                if (Math.random()<0.1) {
                    particle.direction ^= 1;
                }
                
            }
            // Only retains particles which are not being culled. This is the culling step.
            particles = newParticles

        }


        function renderFrame() {

            // Readjusts canvas size using a utils library - https://webglfundamentals.org
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
                
                // Indicate how to read data from the position buffer - 2 floats, unnormalized
                // And with no offset or stride.
                var size = 2;
                var type = gl.FLOAT;
                var normalize = false;
                gl.vertexAttribPointer(locOfposAttrb, size, type, normalize, 0,0 )

                // Transforms particle location based on its coordinates.
                var matrix = MatrixOps.translation(particle.x,particle.y);
                gl.uniformMatrix3fv(matrixloc, false, matrix);

                // Colour snow particle with its unique colour.
                gl.uniform4fv(colourloc, particle.colour);
                
        
                var primitiveType = gl.TRIANGLES;
                var count = SIDES_PER_CIRCLE*3;
                gl.drawArrays(primitiveType, 0, count);
    
            }

            window.requestAnimationFrame(tick);
        }
    }
}

function addSnow(gl) {


    // Sets a random position for a new snow particle
    var randx = (Math.random()-0.5)*2;
    var randy = (Math.random()-0.5)*2;

    // Creates a particle object
    var circle = new Circle(Math.random()*0.005,randx, randy);
    
    // Chooses a random direction for snow to move initially
    if (Math.random()<0.5) {
        circle.direction = 0;
    } else {
        circle.direction = 1;
    }

    // Vary colour for snow particles
    var r = Math.random()*0.2;
    circle.colour = [1-r,1-r,1-r,1];

    // Creates vertices for the circle and buffers them
    var vertices = circle.getVertices(SIDES_PER_CIRCLE);
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Stores the buffer with the particle
    circle.posBuffer = posBuffer;
    return circle;
}


window.onload = init;


/**********************  Event Listeners   **********************/



var mouseX;
var mouseY;

// Mouse Click Detection. Allows both left and right clicking simultaneously.
var mouseDown = 0;

document.body.onmousedown = function() { 
  mouseDown++;
  document.getElementById('overlay').style.display = 'none';
}

document.body.ontouchstart = function() { 
    mouseDown++;
    document.getElementById('overlay').style.display = 'none';
  }
  
document.body.ontouchend = function() {
  mouseDown--;
  console.log(mouseDown);
}

document.body.onmouseup = function() {
    mouseDown--;
  }
  
function moveMouse(e) {

    var gl =  document.getElementById("mainCanvas").getContext("webgl");
    var relPos = getCanvasMousePos(e, gl.canvas);

    mouseX = relPos.x / gl.canvas.width  *  2 - 1;
    mouseY = relPos.y / gl.canvas.height * -2 + 1;
}



  window.addEventListener('mousemove', moveMouse);
  window.addEventListener('touchmove', moveMouse);



