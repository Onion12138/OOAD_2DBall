// import absorber_path from  "./constant" 
// import ball_path from "./constant.js"
// import circle_path from "./constant.js"
// import rectangle_path from "./constant.js"
// import triangle_path from "./constant.js"
// import rail_path from "./constant.js"
// import curve_path from "./constant.js"
// import left_paddle_path from "./constant.js"
// import right_paddle_path from "./constant.js"
// import click_path from "./constant.js"
// import rotate from "./constant.js"
// import remove from "./constant.js"
// import enlarge from "./constant.js"
// import shrink from "./constant.js"
// import triangle from "./triangle.js"
class Triangle{
    constructor(x, y, scale, name, id){
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.name = name;
        this.id = id;
        this.dir = 0;
        this.points = [];
        this.updatePoints();
    }
    updatePoints(){
        this.points = [];
        if(this.dir == 0){
            this.points.push(new Vector(this.x, this.y));
            this.points.push(new Vector(this.x + this.scale * 40, this.y + this.scale * 40));
            this.points.push(new Vector(this.x, this.y + this.scale * 40));
        }
        if(this.dir == 1){
            this.points.push(new Vector(this.x, this.y));
            this.points.push(new Vector(this.x, this.y + this.scale * 40));
            this.points.push(new Vector(this.x + this.scale * 40, this.y)); 
        }
        if(this.dir == 2){
            this.points.push(new Vector(this.x, this.y));
            this.points.push(new Vector(this.x + this.scale * 40, this.y)); 
            this.points.push(new Vector(this.x + this.scale * 40, this.y + this.scale * 40));
        }
        if(this.dir == 3){
            this.points.push(new Vector(this.x, this.y + this.scale * 40));
            this.points.push(new Vector(this.x + this.scale * 40, this.y)); 
            this.points.push(new Vector(this.x + this.scale * 40, this.y + this.scale * 40)); 
        }
    }
    isScaleable(){
        return true;
    }
    isRotatable(){
        return true;
    }
    rotate(){
        this.dir = (this.dir + 1)%4;
        this.updatePoints();
    }
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        // let v1 = new Vector();
        // let v2 = new Vector();
        // let axes = [];
        // for(let i=0;i < this.points.length-1; i++){
        //     v1.x = this.points[i].x;
        //     v1.y = this.points[i].y;
        //     v2.x = this.points[i+1].x;
        //     v2.y = this.points[i+1].y;
        //     axes.push(v1.edge(v2).normal());
        // }
        // v1.x = this.points[this.points.length-1].x;
        // v1.y = this.points[this.points.length-1].y;
        // v2.x = this.points[0].x;
        // v2.y = this.points[0].y;
        // axes.push(v1.edge(v2).normal());
        // return axes;
        let axes = [];
        if(this.dir === 0 || this.dir === 2){
            axes.push(new Vector(Math.sqrt(2), Math.sqrt(2)));
            axes.push(new Vector(0, 1));
            axes.push(new Vector(1, 0));
            return axes;
        }
        if(this.dir === 1 || this.dir === 3){
            axes.push(new Vector(Math.sqrt(2), -Math.sqrt(2)))
            axes.push(new Vector(0, 1));
            axes.push(new Vector(1, 0));
            return axes; 
        }
        
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    handleCollision(mtv, ball){
        if(mtv.axis !== undefined){
            let p = mtv.axis.perpendicular();
            let len = p.getMagnitude();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = p.x * (2 * vec.dot(p) / Math.pow(len, 2)) - vec.x;
            ball.vy = p.y * (2 * vec.dot(p) / Math.pow(len, 2)) - vec.y;
        }
    }
}
class Square{
    constructor(x, y, scale, name, id){
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.name = name;
        this.id = id;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return true;
    }
    isRotatable(){
        return false;
    }
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + this.scale * 40, this.y + this.scale * 40));
        this.points.push(new Vector(this.x, this.y + this.scale * 40));
        this.points.push(new Vector(this.x + this.scale * 40, this.y));
    }
    getAxes(){
        // let v1 = new Vector();
        // let v2 = new Vector();
        // let axes = [];
        // for(let i=0;i < this.points.length-1; i++){
        //     v1.x = this.points[i].x;
        //     v1.y = this.points[i].y;
        //     v2.x = this.points[i+1].x;
        //     v2.y = this.points[i+1].y;
        //     axes.push(v1.edge(v2).normal());
        // }
        // v1.x = this.points[this.points.length-1].x;
        // v1.y = this.points[this.points.length-1].y;
        // v2.x = this.points[0].x;
        // v2.y = this.points[0].y;
        // axes.push(v1.edge(v2).normal());
        // return axes;
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + 20, ball.y + 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            let projection1 = this.project(axis);
            let projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    handleCollision(mtv, ball){
        if(mtv.axis !== undefined){
            let p = mtv.axis.perpendicular();
            let len = p.getMagnitude();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = p.x * (2 * vec.dot(p) / Math.pow(len, 2)) - vec.x;
            ball.vy = p.y * (2 * vec.dot(p) / Math.pow(len, 2)) - vec.y;
        }
    }
    getClosestToBall(ball){
        let min = Number.MAX_VALUE;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - 20, 2) + Math.pow(testPoint.y - ball.y - 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class Circle{
    constructor(x, y, scale, name, id){
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.name = name;
        this.id = id;
    }
    isScaleable(){
        return true;
    }
    isRotatable(){
        return false;
    }
    collidesWith(ball){
        let distance = Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2));
        return distance < Math.abs(this.scale * 20 + ball.scale * 20);
    }
    handleCollision(ball){
        ball.vx = -ball.vx;
        ball.vy = -ball.vy;
    }
}
class Absorber{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return false;
    }
    isRotatable(){
        return false;
    }
    handleCollision(ball){
        ball.vx = 0;
        ball.vy = 0;
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 40));
        this.points.push(new Vector(this.x, this.y + 40));
        this.points.push(new Vector(this.x + 40, this.y));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class Ball{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.vx = 0;
        this.vy = 0;
    }
    isScaleable(){
        return false;
    }
    project(axis){
        let scalars = [];
        let vec = new Vector(this.x + this.scale * 20, this.y + this.scale * 20);
        let dotProduct = vec.dot(axis);
        scalars.push(dotProduct);
        scalars.push(dotProduct + this.scale * 20);
        scalars.push(dotProduct - this.scale * 20);
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
}
class Rail{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.dir = 0;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return false;
    }
    isRotatable(){
        return true;
    }
    rotate(){
        this.dir = (this.dir + 1) % 2;
        this.updatePoints();
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 40));
        this.points.push(new Vector(this.x, this.y + 40));
        this.points.push(new Vector(this.x + 40, this.y)); 
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    handleCollision(ball){
        //dir === 0, horizontal
        if(this.dir === 0){
            ball.vy = 0;
        }
        if(this.dir === 1){
            ball.vx = 0;
        }
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class Curve{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.dir = 0;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return false;
    }
    isRotatable(){
        return true;
    }
    rotate(){
        this.dir = (this.dir + 1) % 4;
        this.updatePoints();
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 40));
        this.points.push(new Vector(this.x, this.y + 40));
        this.points.push(new Vector(this.x + 40, this.y)); 
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    handleCollision(ball){
        //dir === 0, /
        if(this.dir === 0){
            if((ball.vx == 0 && ball.vy > 0) || (ball.vy == 0 && ball.vx > 0)){
                ball.vx = -ball.vy;
                ball.vy = -ball.vx;
            }
            else{
                if(Math.random()>0.5){
                    ball.vy = -2;
                    ball.vx = 0;
                }else{
                    ball.vx = -2;
                    ball.vy = 0;
                }
            }
        }
        if(this.dir === 1){
            if((ball.vx == 0 && ball.vy > 0) || (ball.vy == 0 && ball.vx < 0)){
                ball.vx = ball.vy;
                ball.vy = ball.vx;
            }
            else{
                if(Math.random()>0.5){
                    ball.vy = -2;
                    ball.vx = 0;
                }else{
                    ball.vx = 2;
                    ball.vy = 0;
                }
            }
        }
        if(this.dir === 2){
            if((ball.vx == 0 && ball.vy < 0) || (ball.vy == 0 && ball.vx < 0)){
                ball.vx = -ball.vy;
                ball.vy = -ball.vx;
            }
            else{
                if(Math.random()>0.5){
                    ball.vy = 2;
                    ball.vx = 0;
                }else{
                    ball.vx = 2;
                    ball.vy = 0;
                }
            }
        }
        if(this.dir === 3){
            if((ball.vx == 0 && ball.vy < 0) || (ball.vy == 0 && ball.vx > 0)){
                ball.vx = ball.vy;
                ball.vy = ball.vx;
            }
            else{
                if(Math.random()>0.5){
                    ball.vy = 2;
                    ball.vx = 0;
                }else{
                    ball.vx = -2;
                    ball.vy = 0;
                }
            }
        }
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class LeftPaddle{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return false;
    }
    isRotatable(){
        return false;
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 10));
        this.points.push(new Vector(this.x, this.y + 10));
        this.points.push(new Vector(this.x + 40, this.y)); 
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class RightPaddle{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.points = [];
        this.updatePoints();
    }
    isScaleable(){
        return false;
    }
    isRotatable(){
        return false;
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 10));
        this.points.push(new Vector(this.x, this.y + 10));
        this.points.push(new Vector(this.x + 40, this.y)); 
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    collidesWith(ball){
        let closePoint = this.getClosestToBall(ball);
        let axes = this.getAxes();
        let v1 = new Vector(ball.x + ball.scale * 20, ball.y + ball.scale * 20);
        let v2 = new Vector(closePoint.x, closePoint.y);
        axes.push(v1.substract(v2).normalize());
        return this.separationOnAxes(axes, ball).axis === undefined;
    }
    separationOnAxes(axes, ball){
        let minOverlap = 10000;
        let axisWithMinOverlap;
        for(let i=0;i<axes.length;i++){
            let axis = axes[i];
            projection1 = this.project(axis);
            projection2 = ball.project(axis);
            if(! projection1.overlaps(projection2)){
                return {axis: undefined, overlap: 0};
            }else{
                if(overlap < minOverlap){
                    minOverlap = overlap;
                    axisWithMinOverlap = axis;
                }
            }
        }
        return {axis: axisWithMinOverlap, overlap: minOverlap};
    }
    getClosestToBall(ball){
        let min = 10000;
        let closePoint;
        for(let i=0;i < this.points.length; i++){
            let testPoint = this.points[i];
            let len = Math.sqrt(Math.pow(testPoint.x - ball.x - ball.scale * 20, 2) + Math.pow(testPoint.y - ball.y - ball.scale * 20, 2));
            if(len < min){
                min = len;
                closePoint = testPoint;
            }
        }
        return closePoint;
    }
}
class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    dot(vec){
        return this.x * vec.x + this.y * vec.y;
    }
    substract(vec){
        let v = new Vector();
        v.x = this.x - vec.x;
        v.y = this.y - vec.y;
        return v;
    }
    edge(vec){
        return this.substract(vec);
    }
    getMagnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    perpendicular(){
        let v = new Vector();
        v.x = this.y;
        v.y = 0 - this.x;
        return v;
    }
    normalize(){
        let v = new Vector(0, 0);
        let m = this.getMagnitude();
        if(m != 0){
            v.x = this.x / m;
            v.y = this.y / m;
        }
        return v;
    }
    normal(){
        let p = this.perpendicular();
        return p.normalize();
    }
}
class Projection{
    constructor(min, max){
        this.min = min;
        this.max = max;
    }
    overlaps(projection){
        return this.max > projection.min && projection.max > this.min;
    }
}
let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
let componentList = new Array();
let positionOccupied = new Array(400).fill(-1);
let count = 0;
let gravity = 2;
var ball;
function newObject(name, x, y){
    if(name == "triangle"){
        count++;
        return new Triangle(x, y, 1, name, count);
    }
    if(name == "square"){
        count++;
        return new Square(x, y, 1, name, count);
    }
    if(name == "circle"){
        count++;
        return new Circle(x, y, 1, name, count);
    }
    if(name == "absorber"){
        count++;
        return new Absorber(x, y, name, count);
    }
    if(name == "ball"){
        count++;
        return new Ball(x, y, name, count);
    }
    if(name == "rail"){
        count++;
        return new Rail(x, y, name, count);
    }
    if(name == "curve"){
        count++;
        return new Curve(x, y, name, count);
    }
    if(name == "paddle-left"){
        let component = componentList.find(item => item.name === name);
        if(component !== undefined){
            positionOccupied[component.x/40*20+component.y/40] = -1;
            context.clearRect(component.x, component.y, 40, 10);
            drawGrid();
            component.x = x;
            component.y = y;
            component.updatePoints();
            return component;
        }else{
            count++;
            return new LeftPaddle(x, y, name, count);
        }
    }
    if(name == "paddle-right"){
        let component = componentList.find(item => item.name === name);
        if(component !== undefined){
            positionOccupied[component.x/40*20+component.y/40] = -1;
            context.clearRect(component.x, component.y, 40, 10);
            drawGrid();
            component.x = x;
            component.y = y;
            component.updatePoints();
            return component;
        }else{
            count++;
            return new RightPaddle(x, y, name, count);
        }
    }
}
function windowToCanvas(x, y){
    var bbox = canvas.getBoundingClientRect();
    return {x:x-bbox.left, y: y-bbox.top};
}
function positionToInteger(x, y){
    return {x_int:parseInt(x/40)*40,y_int:parseInt(y/40)*40};
}
function drawGrid(){
    for(let i = 0; i < 800; i += 40){
        context.beginPath();
        context.moveTo(i,0);
        context.lineTo(i,800);
        context.stroke();
        context.closePath();
    }
    for(let i = 0; i < 800; i += 40){
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(800,i);
        context.stroke();
        context.closePath();
    }
}
function addComponent(x, y, name){
    if(positionOccupied[x/40*20+y/40] !== -1)
        return;
    if(name === "ball" && ball !== undefined){
        context.clearRect(ball.x, ball.y, 40, 40);
        positionOccupied[ball.x/40*20 + ball.y/40] = -1;
        drawGrid();
        ball.x = x;
        ball.y = y;
    }
    let image = new Image();
    if(name !== "paddle-left" && name !== "paddle-right"){
        if(name === "triangle" || name === "rail" || name === "curve"){
            image.src = "../img/" + name + "0.png";
        }else{
            image.src = "../img/" + name + ".png";
        }
        image.onload = function(){
            context.drawImage(image, x, y, 40, 40);
        }
    }else{
        image.src = "../img/paddle.png";
        image.onload = function(){
            context.drawImage(image, x, y, 40, 40);
        }
    }
    if(name !== "ball"){
        let obj = newObject(name, x, y);
        console.log(obj);
        componentList.push(obj);
        positionOccupied[x/40*20+y/40] = obj.id;
    }else{
        ball = newObject(name, x, y);
        positionOccupied[x/40*20+y/40] = 0;
    }
}
function isComponent(name){
    if(name == "rotation" || name == "delete" || name == "plus" || name == "minus"){
        return false;
    }else{
        return true;
    }
}
function getCurrentChecked(){
    let component = document.getElementsByName('component');
    for(let i=0;i<component.length;i++){
        if(component[i].checked == true){
            return component[i].value;
        }
    }
}
function rotate(x, y){
    let id = positionOccupied[x/40*20+y/40];
    if(id === -1 || id === 0){
        return;
    }
    let component = componentList.find(item => item.id === id);
    if(!component.isRotatable()){
        return;
    }
    if(component.scale === undefined){
        context.clearRect(component.x, component.y, 40, 40);
    }else{
        context.clearRect(component.x, component.y, component.scale * 40, component.scale * 40);
    }
    component.rotate();
    rerender();
    
    // let image = new Image();
    // image.src = "../img/" + component.name + component.dir + ".png";
    // image.onload = function(){
    //     if(component.scale === undefined){
    //         context.drawImage(image, component.x, component.y, 40, 40);
    //     }else{
    //         context.drawImage(image, component.x, component.y, component.scale * 40, component.scale * 40); 
    //     }
    // }
}
function remove(x, y, id){
    if(id == -1 || id != positionOccupied[x/40*20+y/40])
        return;
    if(x < 0 || y < 0 || x >= 800 || y >= 800)
        return;
    context.clearRect(x, y, 40, 40);
    positionOccupied[x/40*20+y/40]= -1;
    for(var i=0;i<componentList.length;i++){
        if(componentList[i].id == id){
            componentList.splice(i,1);
        }
    }
    remove(x+40, y-40, id)
    remove(x+40, y, id);
    remove(x+40, y+40, id);
    remove(x-40, y-40, id);
    remove(x-40, y, id);
    remove(x-40, y+40, id);
    remove(x, y+40, id);
    remove(x, y-40, id);
    rerender();
}
function fakeRemove(x, y, id){
    if(id == -1 || id != positionOccupied[x/40*20+y/40])
        return;
    if(x < 0 || y < 0 || x >= 800 || y >= 800)
        return;
    context.clearRect(x, y, 40, 40);
    positionOccupied[x/40*20+y/40]= -1;
    fakeRemove(x+40, y-40, id)
    fakeRemove(x+40, y, id);
    fakeRemove(x+40, y+40, id);
    fakeRemove(x-40, y-40, id);
    fakeRemove(x-40, y, id);
    fakeRemove(x-40, y+40, id);
    fakeRemove(x, y+40, id);
    fakeRemove(x, y-40, id);
    rerender();
}
function enlarge(id){
    if(id === 0 || id === -1){
        return;
    }
    let component = componentList.find(item => item.id === id);
    if(!component.isScaleable()){
        return;
    }
    if(component.scale === 4){
        return; 
    }
    fakeRemove(component.x, component.y, id);
    component.scale ++;
    let image = new Image();
    let name = component.name;
    if(component.isRotatable()){
        image.src = "../img/" + name + component.dir + ".png";
    }else{
        image.src = "../img/" + name + ".png";
    }
    image.onload = function(){
        context.drawImage(image, component.x, component.y, 40 * component.scale, 40 * component.scale);
    }
    for(let i=component.x;i<component.x+component.scale*40 && i < 800;i+=40){
        for(let j=component.y;j<component.y+component.scale*40 && j < 800;j+=40){
            positionOccupied[i/40*20+j/40] = id;
        }
    }
}
function shrink(id){
    if(id === 0 || id === -1){
        return;
    }
    let component = componentList.find(item => item.id === id);
    if(!component.isScaleable()){
        return;
    }
    if(component.scale === 1){
        return;
    }
    fakeRemove(component.x, component.y, id);
    component.scale --;
    let image = new Image();
    let name = component.name;
    if(component.isRotatable()){
        image.src = "../img/" + name + component.dir + ".png";
    }else{
        image.src = "../img/" + name + ".png";
    }
    image.onload = function(){
        context.drawImage(image, component.x, component.y, 40 * component.scale, 40 * component.scale);
    }
    for(let i=component.x;i<component.x+component.scale*40 && i < 800;i+=40){
        for(let j=component.y;j<component.y+component.scale*40 && j < 800;j+=40){
            positionOccupied[i/40*20+j/40] = id;
        }
    }
}
function update(ball){
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
}
function rerender(){
    drawGrid();
    for(let i = 0; i < componentList.length; i++){
        let image = new Image();
        let name = componentList[i].name;
        if(name === "paddle-left" || name === "paddle-right"){
            image.src = "../img/paddle.png";
        }
        else if(componentList[i].isRotatable()){
            image.src = "../img/" + name + componentList[i].dir + ".png";
        }else{
            image.src = "../img/" + name + ".png";
        }
        console.log(image.src);
        let x = componentList[i].x;
        let y = componentList[i].y;
        image.onload = function(){
            if(componentList[i].isScaleable()){
                context.drawImage(image, x, y, componentList[i].scale * 40, componentList[i].scale * 40);
            }else{
                context.drawImage(image, x, y, 40, 40);
            }
        }
    }
}
function repaintBall(x, y){
    context.clearRect(x, y, 40, 40);
    drawGrid(); 
}
function render(ball, old_x, old_y){
    repaintBall(old_x, old_y);
    let image = new Image();
    image.src = "../img/ball.png";
    image.onload = function(){
        context.drawImage(image, ball.x, ball.y, 40, 40);
    } 
}
function timer(){
    let old_x = ball.x;
    let old_y = ball.y;
    for(let i = 0; i < componentList.length; i++){
        if(componentList[i].collidesWith(ball)){
            console.log("collide with " + componentList[i].name);
            componentList[i].handleCollision(ball);
        }
    }
    update(ball);
    render(ball, old_x, old_y);
}
window.onload = function(){
    let playButton = document.getElementById("play");
    let designButton = document.getElementById("design");
    let method;
    playButton.onclick = function play(){
        if(ball !== undefined){
            method = setInterval(timer,50);
        }
    }
    designButton.onclick = function design(){
        clearInterval(method);
    }
    canvas.onmousedown = function(e){
        e.preventDefault();
        let point = windowToCanvas(e.clientX, e.clientY);
        let integerPoint = positionToInteger(point.x, point.y);
        let x = integerPoint.x_int;
        let y = integerPoint.y_int;
        let name = getCurrentChecked();
        let id = positionOccupied[x/40*20+y/40]; 
        if(isComponent(name)){
            addComponent(x, y, name);
        }else{
            if(name == "rotation"){
                rotate(x, y);
            }else if(name == "delete"){
                remove(x, y, id);
            }else if(name == "plus"){
                enlarge(id);
            }else if(name == "minus"){
                shrink(id);
            }
        }
    }
    canvas.width = 800;
    canvas.height = 800;
    drawGrid(context);
    
}