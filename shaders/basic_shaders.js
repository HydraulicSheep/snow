// Basic GLSL Shaders

export var vertex_shader = `

    attribute vec4 pos;

    void main() {

        gl_Position = pos;

    }

`;


export var fragment_shader = `

    precision mediump float;

    void main() {

        gl_FragColor = vec4(1,1,1,1);

    }

`;