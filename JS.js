//canvas setup
const  canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let speed_reduction = 30;
let gameSpeed = 1;



//mouse setting
let canvasPosition = canvas.getBoundingClientRect();

const mouse ={
    x : canvas.width/2,
    y : canvas.height/2,
    click : false
}

canvas.addEventListener('mousedown', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});

//Repeating backgrounds
const backgrounds = new Image();
backgrounds.src = 'background1.png'

const BG = {
    x1:0,
    x2:canvas.width-5,
    y:0,
    width: canvas.width,
    height: canvas.height,
}

function handleBackground(){
    BG.x1--;
    BG.x2--;
    if(BG.x1 < -BG.width) BG.x1 = BG.width-10;
    if(BG.x2 < -BG.width) BG.x2 = BG.width-10;
    ctx.drawImage(backgrounds,BG.x1,BG.y,BG.width, BG.height);
    ctx.drawImage(backgrounds,BG.x2,BG.y,BG.width, BG.height);

}

//player charecter

const playerLeft = new Image();
playerLeft.src = 'fish_swimleft.png';
const playerRight = new Image();
playerRight.src = 'fish_swimright.png';

class Player{
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame=0;
        this.spriteWidth =498;
        this.spriteHeight =327;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if(mouse.x != this.x){
            this.x -= dx/speed_reduction;
        }
        if(mouse.y != this.y){
            this.y -= dy/speed_reduction;
        }
        


    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth,
                 this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,
                 this.x -60, this.y-50, this.spriteWidth/4, this.spriteHeight/4);
        }else{
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth,
                 this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,
                 this.x -60, this.y-50, this.spriteWidth/4, this.spriteHeight/4);
        }
        
    }
}
const player = new Player();


//bubbles
const bubblesArray= [];

const bubbleImage = new Image();
bubbleImage.src = 'bubble_pop_under_water_spritesheet.png';



class Bubble{
    constructor(){
        this.radius = 50;
        this.x = Math.random()*canvas.width;
        this.y = canvas.height + this.radius;
        this.speed = Math.random()* 3 + 1;
        this.distance;
        this.spriteHeight = 511.5;
        this.spriteWidth = 393.75;
        this.frameX = 0;
        this.frameY = 0;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx+dy*dy);
    }
    draw(){
        if(this.counted == false){
            ctx.drawImage(bubbleImage, this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,
                this.x- this.radius, this.y - (this.radius*1.55), this.spriteWidth/4, this.spriteHeight/4);
        }else{
            if (this.frameX != 4 && this.frameY != 2){
                if(this.frameX != 4){
                    this.frameX++;
                }else{
                    this.frameY++;
                }
            }
            ctx.drawImage(bubbleImage, this.frameX * this.spriteWidth,
                this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,
                this.x- this.radius, this.y - (this.radius*1.55), this.spriteWidth/4, this.spriteHeight/4);

        }
        
    }

}
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubbles-single1.wav';

function handleBubbles(){
    if (gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
        if (bubblesArray[i].y < 0 - this.radius){
            bubblesArray.splice(i, 1);
            i--;
        }
        if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            if(!bubblesArray[i].counted){
                if(bubblesArray[i].sound == 'sound1'){
                    bubblePop1.play();
                    score++;
                    bubblesArray[i].counted = true;  
                }else{bubblePop2.play();}
                    score++;
                    bubblesArray[i].counted = true;  
            }
        }
    }
}

function scoresystem(){
    ctx.fillStyle = 'black';
    ctx.fillText('score: '+ score, 10, 50);
}
//animation loop
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    handleBackground();
    player.update();
    player.draw();
    handleBubbles();
    scoresystem();
    gameFrame++;
    //recursion will call animate function over and over
    requestAnimationFrame(animate);
}
animate();
window.addEventListener('resize',function(){
    canvasPosition = canvas.getBoundingClientRect();
});