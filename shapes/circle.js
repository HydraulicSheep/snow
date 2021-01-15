

export class Circle {

    constructor(radius, x, y, colour) {

        this.radius = radius;
        this.x = x;
        this.y = y;
        this.v = -Math.random()*this.radius-0.001;
        this.hv = 0;
        this.colour = colour;
        this.posBuffer;
        this.direction;
        this.colour = [];


    }

    // Generates n Triangles to form the circle and returns a vertex array
    // Each point is a rotation around the 
    getVertices(n) {

        var angle = 2*Math.PI/n;

        var vertices = [];
        var theta = 0;

        while(theta < 2*Math.PI) {
            var x = this.radius*Math.cos(theta);
            var y = this.radius*Math.sin(theta);
            
            vertices.push(x,y);

            vertices.push(0, 0);
            theta += angle;

            x = this.radius*Math.cos(theta);
            y = this.radius*Math.sin(theta);

            vertices.push(x,y);

            
            
        }

        return vertices;

    }







}