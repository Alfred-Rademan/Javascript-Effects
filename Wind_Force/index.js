
const canvas = document.getElementById("canvas0");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const sandAmount = 1000;
let sandArray = [];

function particleDraw() {

    class Sand {
        constructor(xPos, yPos, size,weight, colour) {
            this.xPos = xPos;
            this.yPos = yPos;
            this.size = size;
            this.colour = colour;
            this.weight = weight;
        }

        //create a sand particle at a given instance
        Draw() {
            context.beginPath();
            context.arc(this.xPos,this.yPos,this.size,0,Math.PI*2);
            context.closePath();
            context.fill();
        }

        applyGravity() {
            this.yPos += 9.8;
        }
    

        Update() {
            context.fillStyle = this.colour;
            this.applyGravity();
            this.Draw();
        }

    }

    function init() {
        sandArray = [];
        for (let i = 0; i < sandAmount; i++) {
            let xPos = Math.random() * canvas.width;
            let yPos = Math.random() * canvas.height;
            sandArray.push(new Sand(xPos,yPos,3,2,"rgb(0,0,0,200)"));
            sandArray[i].Draw();
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        context.fillStyle = 'rgba(239,5,5,0.5)';
            context.fillRect(0,0,innerWidth,innerHeight);
        for (let i = 0; i < sandArray.length;i++){
            sandArray[i].Update();
            //console.log(i);
        }

    }

    init();
    animate();
    //apply the sum of all vertical forces on the particle
    

    //apply the sum of all horizontal forces on the particle
    



}

window.addEventListener("load", (e) => {
console.log("Loaded");
particleDraw();
});