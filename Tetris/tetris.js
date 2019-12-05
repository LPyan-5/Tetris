import Game from './game.js';
const game = new Game();
window.game=game;

const row=20;
const col=10;
const r=[];

function createTable(){
    let mainDiv=document.createElement("div");
    mainDiv.setAttribute('id','mainDiv');
    mainDiv.style.cssText='position :absolute;overflow: hidden;left:80px;top: 65px;height: 640px;width:320px;border: 1px solid yellow;';
    
    for(let i=0;i<row;i++){
        r[i]=[];
        for(let j=0;j<col;j++){
            r[i][j]=document.createElement("div");
            
            r[i][j].setAttribute("id","_"+i+j);
    
            mainDiv.appendChild(r[i][j]);
    }

    document.body.appendChild(mainDiv);
    

}
    createElems();
}

function createElems(){
    const obj=game.getState();
    delete obj.playfield;
    delete obj.isGameOver;
    for(let text in obj){
        if(text === 'nextFigure'){

            let el=document.createElement('p');
            el.innerHTML='Next:';
            document.body.appendChild(el);
        }
        else{
        
            let el=document.createElement('p');
            el.innerHTML=`${text}: ${0}`;
            document.body.appendChild(el);
        }
       
    }
    
    const r=[];
    let blockDiv=document.createElement('div');
    blockDiv.setAttribute('id','next');
    blockDiv.style.cssText='position:relative;left:280%;height: 128px; width: 128px;outline: 1px solid yellow';
            for(let i = 0; i < 4; i++){
                            r[i]=[];
                            for(let j=0; j<4; j++){
                                r[i][j]=document.createElement('div');
                                r[i][j].style.cssText='float:left';
                                r[i][j].setAttribute('id','__'+i+j);
                                blockDiv.appendChild(r[i][j]);
                                 
                    
                            }
                }
                document.body.appendChild(blockDiv);
                

                
}

function drawBoxes(){

    let {playfield}=game.getState();
    for(let i = 0; i<row; i++){
        for(let j= 0; j<col;j++){
            if(playfield[i][j]){
                
                r[i][j].style.cssText="outline: 1.5px solid black;";
                r[i][j].style.backgroundColor=game.colors[playfield[i][j]];

            

        
            }
            else
            if(game.playfield[i][j]===0){
                r[i][j].style.backgroundColor='black';
            }
            

        }
    }
}


let isPlaying=true;
let intervalId=null;
intervalId=setInterval(()=>{
    game.moveFigureDown();
    drawBoxes();
        
},1000);
function play(){
    isPlaying=true;
    startTimer();
    updateScreen();
   
}
function pause(){
    isPlaying=false;
    stopTimer();
    updateScreen();

   
    
  
}
function startTimer(){

    const speed = 1000 - game.getState().level*100;
    if(!intervalId){
        intervalId=setInterval(()=>{
            game.moveFigureDown();
            drawBoxes();
                
        },speed>0 ?speed:100);
    }
}

function stopTimer(){
    if(intervalId){
        clearInterval(intervalId);
        intervalId=null;
    }
}

function gamePause(){
    document.getElementById('pause').style.display='block';
}

function gameStart(){
    document.getElementById('pause').style.display='none';
}

function updateScreen(){
    if(!isPlaying){
        gamePause();
    }
    else{
        gameStart();
    }

   
}


document.addEventListener('keydown',(event)=>{
    const state=game.getState();
    if(event.keyCode===13){
        if(state.isGameOver){
           window.location.reload();
        }
        
    }
    if(event.keyCode===32){
        if(isPlaying){
            pause();
        }
        else{
            play();
        }
    }
    if(event.keyCode===38){
        game.rotateFigure();
        drawBoxes();

    }
    
    if(event.keyCode===40){
        stopTimer();
        game.moveFigureDown();
        drawBoxes();
    }
    
    if(event.keyCode===39){
        game.moveFigureRight();
        drawBoxes();
    }
    
    if(event.keyCode===37){
        game.moveFigureLeft();
        drawBoxes();
    }
});
document.addEventListener('keyup',(event)=>{
    if(event.keyCode===40){
            startTimer();
    }
})


    

createTable();
drawBoxes();
game.updateElems();









