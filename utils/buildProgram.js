
export function buildProgram(gl, vertex_source, fragment_source) {

    var vertex_shader = compileShader(gl,vertex_source, gl.VERTEX_SHADER);
    var fragment_shader = compileShader(gl,fragment_source, gl.FRAGMENT_SHADER);

    // Checks for successful compilation of both shaders
    if (vertex_shader === null || fragment_shader === null) {
        console.log('Program Build Halted due to Failed Shader Build');
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);

    // Indictes whether linking the program was successful
    var linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (linkStatus) {
        console.log('Program Linked Successfully');
        return program;
    }
    else {
        console.lof('Program Build Failed');
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

}

function compileShader(gl, source, type) {

    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Indicates whether the shader compile was successful
    var compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (compileStatus) {
        console.log('Successfully compiled a shader of type '+ type);
        return shader;
    }

    else {
        console.log('Failed to compile shader');
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }


}