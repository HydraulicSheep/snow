// Basic GLSL Shaders

export var vertex_shader = `

    attribute vec3 pos;
    uniform mat3 transformation_matrix;

    void main() {

        gl_Position = vec4(transformation_matrix*pos,1);

    }

`;


export var fragment_shader = `

    precision mediump float;

    void main() {

        gl_FragColor = vec4(1,1,1,1);

    }

`;