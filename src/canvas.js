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
    scaleUp(){
        this.scale ++;
        this.updatePoints();
    }
    scaleDown(){
        this.scale --;
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
        let axes = [];
        if(this.dir === 0 || this.dir === 2){
            axes.push(new Vector(Math.sqrt(2)/2, Math.sqrt(2)/2));
            axes.push(new Vector(0, 1));
            axes.push(new Vector(1, 0));
            return axes;
        }
        if(this.dir === 1 || this.dir === 3){
            axes.push(new Vector(Math.sqrt(2)/2, -Math.sqrt(2)/2))
            axes.push(new Vector(0, 1));
            axes.push(new Vector(1, 0));
            return axes; 
        }
    }
    handleCollision(ball){
        let mtv = separationOnAxes(this, ball);
        if(mtv.axis !== undefined){
            let p = mtv.axis.normalize();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = vec.x - p.x * (2 * vec.dot(p));
            ball.vy = vec.y - p.y * (2 * vec.dot(p));
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
    scaleUp(){
        this.scale ++;
        this.updatePoints();
    }
    scaleDown(){
        this.scale --;
        this.updatePoints();
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
        return this.separationOnAxes(axes, ball).axis !== undefined;
    }
    handleCollision(ball){
        let mtv = separationOnAxes(this, ball);
        if(mtv.axis !== undefined){
            let p = mtv.axis.normalize();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = vec.x - p.x * (2 * vec.dot(p));
            ball.vy = vec.y - p.y * (2 * vec.dot(p));
        }
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
    scaleUp(){
        this.scale ++;
    }
    scaleDown(){
        this.scale --;
    }
    isRotatable(){
        return false;
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
        this.scale = 1;
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
        ball.x = this.x;
        ball.y = this.y;
    }
    updatePoints(){
        this.points = [];
        this.points.push(new Vector(this.x, this.y));
        this.points.push(new Vector(this.x + 40, this.y + 40));
        this.points.push(new Vector(this.x, this.y + 40));
        this.points.push(new Vector(this.x + 40, this.y));
    }
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
}
class Ball{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.scale = 1;
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
        this.scale = 1;
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
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    handleCollision(ball){
        //dir === 0, vertical
        if(this.dir === 0){
            ball.vx = 0;
            ball.x = this.x;
        }
        if(this.dir === 1){
            ball.vy = 0;
            ball.y = this.y;
        }
    }
}
class Curve{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.scale = 1;
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
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    handleCollision(ball){
        let p;
        if(this.dir == 0){
            p = new Vector(-1, -1);
        }
        if(this.dir == 1){
            p = new Vector(1, -1);
        }
        if(this.dir == 2){
            p = new Vector(1, 1);
        }
        if(this.dir == 3){
            p = new Vector(-1, 1);
        }
        let vec = new Vector(ball.vx, ball.vy);
        ball.vx = vec.x - p.x * (2 * vec.dot(p));
        ball.vy = vec.y - p.y * (2 * vec.dot(p));
        //dir === 0, /
        // if(this.dir === 0){
        //     if((ball.vx == 0 && ball.vy > 0) || (ball.vy == 0 && ball.vx > 0)){
        //         ball.vx = -ball.vy;
        //         ball.vy = -ball.vx;
        //     }
        //     else{
        //         if(random>0.5){
        //             ball.vy = -1;
        //             ball.vx = 0;
        //         }else{
        //             ball.vx = -1;
        //             ball.vy = 0;
        //         }
        //     }
        // }
        // if(this.dir === 1){
        //     if((ball.vx == 0 && ball.vy > 0) || (ball.vy == 0 && ball.vx < 0)){
        //         ball.vx = ball.vy;
        //         ball.vy = ball.vx;
        //     }
        //     else{
        //         if(random>0.5){
        //             ball.vy = -1;
        //             ball.vx = 0;
        //         }else{
        //             ball.vx = 2;
        //             ball.vy = 0;
        //         }
        //     }
        // }
        // if(this.dir === 2){
        //     if((ball.vx == 0 && ball.vy < 0) || (ball.vy == 0 && ball.vx < 0)){
        //         ball.vx = -ball.vy;
        //         ball.vy = -ball.vx;
        //     }
        //     else{
        //         if(random>0.5){
        //             ball.vy = 1;
        //             ball.vx = 0;
        //         }else{
        //             ball.vx = 1;
        //             ball.vy = 0;
        //         }
        //     }
        // }
        // if(this.dir === 3){
        //     if((ball.vx == 0 && ball.vy < 0) || (ball.vy == 0 && ball.vx > 0)){
        //         ball.vx = ball.vy;
        //         ball.vy = ball.vx;
        //     }
        //     else{
        //         if(random>0.5){
        //             ball.vy = 1;
        //             ball.vx = 0;
        //         }else{
        //             ball.vx = -1;
        //             ball.vy = 0;
        //         }
        //     }
        // }
    }
}
class LeftPaddle{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.scale = 1;
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
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    handleCollision(ball){
        let mtv = separationOnAxes(this, ball);
        if(mtv.axis !== undefined){
            let p = mtv.axis.normalize();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = vec.x - p.x * (2 * vec.dot(p));
            ball.vy = vec.y - p.y * (2 * vec.dot(p));
        }
    }
}
class RightPaddle{
    constructor(x, y, name, id){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.scale = 1;
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
    project(axis){
        let scalars = [];
        this.points.forEach(point =>{
            scalars.push(point.dot(axis));
        })
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    }
    getAxes(){
        let axes = [];
        axes.push(new Vector(1,0));
        axes.push(new Vector(0,1));
        return axes;
    }
    handleCollision(ball){
        let mtv = separationOnAxes(this, ball);
        if(mtv.axis !== undefined){
            let p = mtv.axis.normalize();
            let vec = new Vector(ball.vx, ball.vy);
            ball.vx = vec.x - p.x * (2 * vec.dot(p));
            ball.vy = vec.y - p.y * (2 * vec.dot(p));
        }
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
        if(this.max > projection.min && projection.max > this.min){
            return projection.min - this.min < 0 ? projection.max - this.min : this.max - projection.min;
        }else{
            return 0;
        }
    }
}
class Mtv{
    constructor(axis, overlap){
        this.axis = axis;
        this.overlap = overlap;
    }
}
let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
// let bufferCanvas = document.createElement("canvas");
// bufferCanvas.width = 800;
// bufferCanvas.height = 800;
// let bufferContext = bufferCanvas.getContext('2d');
let componentList = new Array();
let positionOccupied = new Array(400).fill(-1);
let count = 0;
let gravity = 1;
let ball;
let random;
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
            context.clearRect(0, 0, 800, 800);
            component.x = x;
            component.y = y;
            component.updatePoints();
            rerender();
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
            context.clearRect(0, 0, 800, 800);
            component.x = x;
            component.y = y;
            component.updatePoints();
            rerender();
            return component;
        }else{
            count++;
            return new RightPaddle(x, y, name, count);
        }
    }
}
function collisionDetect(component, ball){
    if(component.name === "circle"){
        let distance = Math.sqrt(Math.pow(component.x - ball.x, 2) + Math.pow(component.y - ball.y, 2));
        let overlap = component.scale * 20 + ball.scale * 20 - distance;
        console.log(overlap);
        return overlap < 0 ? new Mtv(undefined, 0) : (undefined, overlap);
    }else{
        return separationOnAxes(component, ball);
    }
}
function separationOnAxes(component, ball){
    let axes = component.getAxes();
    let closePoint = getClosestToBall(component, ball);
    let vec = new Vector(closePoint.x - ball.x, closePoint.y - ball.y);
    axes.push(vec.normalize());
    let minOverlap = Number.MAX_VALUE;
    let axisWithMinOverlap;
    for(let i=0;i<axes.length;i++){
        let axis = axes[i];
        let projection1 = component.project(axis);
        let projection2 = ball.project(axis);
        let overlap = projection1.overlaps(projection2);
        if(overlap === 0){
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
function getClosestToBall(component, ball){
    let min = Number.MAX_VALUE;
    let closePoint;
    for(let i=0;i < component.points.length; i++){
        let testPoint = component.points[i];
        let len = Math.sqrt(Math.pow(testPoint.x - ball.x - 20, 2) + Math.pow(testPoint.y - ball.y - 20, 2));
        if(len < min){
            min = len;
            closePoint = testPoint;
        }
    }
    return closePoint;
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
        context.clearRect(0, 0, 800, 800);
        positionOccupied[ball.x/40*20 + ball.y/40] = -1;
        ball.x = x;
        ball.y = y;
        positionOccupied[x/40*20+y/40] = 0;
        rerender();
        return;
    }
    if(name === "ball" && ball === undefined){
        ball = newObject(name, x, y);
        positionOccupied[x/40*20+y/40] = 0;
    }else{
        let obj = newObject(name, x, y);
        componentList.push(obj);
        positionOccupied[x/40*20+y/40] = obj.id;
    }
    let image = new Image();
     if(name === "triangle" || name === "rail" || name === "curve"){
        image.src = "../img/" + name + "0.png";
    }else{
        image.src = "../img/" + name + ".png";
    }
    image.onload = function(){
        context.drawImage(image, x, y, 40, 40);
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
function rotate(id){
    if(id === -1 || id === 0){
        return;
    }
    let component = componentList.find(item => item.id === id);
    if(!component.isRotatable()){
        return;
    }
    context.clearRect(0, 0, 800, 800);
    component.rotate();
    rerender();
}
function remove(id){
    if(id === -1)
        return;
    if(id === 0){
        positionOccupied[ball.x/40*20+ball.y/40] = -1;
        ball = undefined;
    }
    context.clearRect(0, 0, 800, 800);
    for(var i=0;i<componentList.length;i++){
        if(componentList[i].id == id){
            let component = componentList[i];
            for(let j = component.x; j < component.x + component.scale * 40; j+= 40){
                for(let k = component.y; k < component.y + component.scale * 40; k+= 40){
                    positionOccupied[j/40*20+k/40] = -1;
                }
            }
            componentList.splice(i,1);
            break;
        }
    }
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
    context.clearRect(0, 0, 800, 800);
    let old_scale = component.scale;
    component.scaleUp();
    let flag = true;
    for(let i=component.x;i<component.x+component.scale*40;i+=40){
        for(let j=component.y;j<component.y+component.scale*40;j+=40){
            if(i < component.x + old_scale * 40 && j < component.y + old_scale * 40){
                continue;
            }
            if(i >= 800 || j >= 800){
                flag = false;
            }
            if(positionOccupied[i/40*20+j/40] != -1){
                flag = false;
            }
        }
    }
    if(!flag){
        component.scaleDown();
    }else{
        for(let i=component.x;i<component.x+component.scale*40;i+=40){
            for(let j=component.y;j<component.y+component.scale*40;j+=40){
                positionOccupied[i/40*20+j/40] = id;
            }
        }
    }
    rerender();
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
    context.clearRect(0, 0, 800, 800);
    let old_scale = component.scale;
    component.scaleDown();
    for(let i=component.x;i<component.x+old_scale*40;i+=40){
        for(let j=component.y;j<component.y+old_scale*40;j+=40){
            if(i < component.x + component.scale * 40 && j < component.y + component.scale * 40){
                positionOccupied[i/40*20+j/40] = id;
            }else{
                positionOccupied[i/40*20+j/40] = -1;
            }
        }
    }
    rerender();
}
function handleWallCollision(ball){
    let p;
    if(ball.x + ball.vx >= 800){
        p = new Vector(-1, 0);
    }else if(ball.y + ball.vy >= 800){
        p = new Vector(0, -1);
    }else if(ball.x + ball.vx < 0){
        p = new Vector(1, 0);
    }else if(ball.y + ball.vy < 0){
        p = new Vector(0, 1);
    }else{
        return;
    }
    let vec = new Vector(ball.vx, ball.vy);
    ball.vx = vec.x - p.x * (2 * vec.dot(p));
    ball.vy = vec.y - p.y * (2 * vec.dot(p));
}
function update(ball){
    handleWallCollision(ball);
    let x_int = parseInt(ball.x/40);
    let y_int = parseInt(ball.y/40);
    if(positionOccupied[x_int*20+y_int] !== -1){
        let id = positionOccupied[x_int*20+y_int];
        let component = componentList.find(item => item.id === id);
        if(component !== undefined){
            if(component.name === "rail" || component.name === "curve"){
                ball.x += ball.vx;
                ball.y += ball.vy;
                return;
            }
        }
    }
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
    ball.vx += Math.random();
}
function rerender(){
    drawGrid();
    for(let i = 0; i < componentList.length; i++){
        let image = new Image();
        let name = componentList[i].name;
        if(componentList[i].isRotatable()){
            image.src = "../img/" + name + componentList[i].dir + ".png";
        }else{
            image.src = "../img/" + name + ".png";
        }
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
    if(ball !== undefined){
        let image = new Image();
        image.src = "../img/ball.png";
        image.onload = function(){
            context.drawImage(image, ball.x, ball.y, 40, 40);
        }
    }
    // context.drawImage(bufferCanvas, 0, 0);
    // bufferContext.clearRect(0, 0, 800, 800);
}
function timer(){
    for(let i = 0; i < componentList.length; i++){
        if(collisionDetect(componentList[i], ball).overlap !== 0){
            componentList[i].handleCollision(ball);
            console.log(componentList[i]);
            break;
        }
    }
    update(ball);
    context.clearRect(0, 0, 800, 800);
    rerender();
}
function rightMoveLeftPaddle(){
    let paddle = componentList.find(item => item.name === "paddle-left");
    if( paddle === undefined){
        return;
    }
    if(paddle.x === 800){
        return;
    }
    if(positionOccupied[(paddle.x/40+1)*20 + paddle.y/40] != -1){
        return;
    }
    positionOccupied[paddle.x/40*20+paddle.y/40] = -1;
    paddle.x += 40;
    paddle.updatePoints();
    positionOccupied[paddle.x/40*20+paddle.y/40] = paddle.id;
    context.clearRect(0, 0, 800, 800);
    rerender();
}
function leftMoveLeftPaddle(){
    let paddle = componentList.find(item => item.name === "paddle-left");
    if( paddle === undefined){
        return;
    }
    if(paddle.x === 0){
        return;
    }
    if(positionOccupied[(paddle.x/40-1)*20 + paddle.y/40] != -1){
        return;
    }
    positionOccupied[paddle.x/40*20+paddle.y/40] = -1;
    paddle.x -= 40;
    paddle.updatePoints();
    positionOccupied[paddle.x/40*20+paddle.y/40] = paddle.id;
    context.clearRect(0, 0, 800, 800);
    rerender();
}
function leftMoveRightPaddle(){
    let paddle = componentList.find(item => item.name === "paddle-right");
    if( paddle === undefined){
        return;
    }
    if(paddle.x === 0){
        return;
    }
    if(positionOccupied[(paddle.x/40-1)*20 + paddle.y/40] != -1){
        return;
    }
    positionOccupied[paddle.x/40*20+paddle.y/40] = -1;
    paddle.x -= 40;
    paddle.updatePoints();
    positionOccupied[paddle.x/40*20+paddle.y/40] = paddle.id;
    context.clearRect(0, 0, 800, 800);
    rerender();
}
function rightMoveRightPaddle(){
    let paddle = componentList.find(item => item.name === "paddle-right");
    if( paddle === undefined){
        return;
    }
    if(paddle.x === 800){
        return;
    }
    if(positionOccupied[(paddle.x/40+1)*20 + paddle.y/40] != -1){
        return;
    }
    positionOccupied[paddle.x/40*20+paddle.y/40] = -1;
    paddle.x += 40;
    paddle.updatePoints();
    positionOccupied[paddle.x/40*20+paddle.y/40] = paddle.id;
    context.clearRect(0, 0, 800, 800);
    rerender();
}
function doKeyDown(e){
    e.preventDefault();
    if(e.key === 'a'){
        leftMoveLeftPaddle();
    }
    if(e.key === 'd'){
        rightMoveLeftPaddle();
    }
    if(e.key === 'ArrowLeft'){
        leftMoveRightPaddle();
    }
    if(e.key === 'ArrowRight'){
        rightMoveRightPaddle();
    }
}
window.onload = function(){
    let playButton = document.getElementById("play");
    let designButton = document.getElementById("design");
    let fileSaveButton = document.getElementById("save");
    let fileLoadButton = document.getElementById("load");
    let method;
    playButton.onclick = function play(){
        if(ball !== undefined){
            positionOccupied[ball.x/40*20+ball.y/40] = -1;
            random = Math.random();
            method = setInterval(timer,100);
        }
    }
    designButton.onclick = function design(){
        clearInterval(method);
    }
    fileSaveButton.onclick = function save(){
        let component = JSON.stringify(componentList);
        let position = JSON.stringify(positionOccupied);
        localStorage.setItem("component", component);
        localStorage.setItem("position", position);
    }
    fileLoadButton.onclick = function load(){
        let list = JSON.parse(localStorage.getItem("component"));
        for(let i = 0; i < list.length; i ++){
            componentList.push(newObject(list[i].name, list[i].x, list[i].y));
        }
        positionOccupied = JSON.parse(localStorage.getItem("position"));
        rerender();
    }
    window.addEventListener('keydown', doKeyDown,true);
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
                rotate(id);
            }else if(name == "delete"){
                remove(id);
            }else if(name == "plus"){
                enlarge(id);
            }else if(name == "minus"){
                shrink(id);
            }
        }
    }
    canvas.width = 800;
    canvas.height = 800;
    drawGrid();
}