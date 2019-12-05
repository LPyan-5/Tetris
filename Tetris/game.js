
export default class Game{
    score=0;
    lines=0;
    gameOver=false;
    colors={
        1: 'blue',
        2: 'orange',
        3: 'yellow',
        4: 'green',
        5: 'purple',
        6: 'red',
        7: 'cyan'
    }
    get level(){
    
        return Math.floor(this.lines*0.1);
    }
    playfield=this.createPlayfield();
    activeFigure=this.createFigure();
    nextFigure=this.createFigure();

    createPlayfield(){
        const playfield=[];
        for(let y=0; y<20; y++){
            playfield[y]=[];
            for(let x=0; x<10; x++){
                playfield[y][x]=0;
            }
        }
        return playfield;
    }
    createFigure(){
        
            const index=Math.floor(Math.random()*7);
            const type='IJLOSTZ'[index];
            const figure={};

            switch(type){
                case 'I': 
                    figure.blocks=[ 
                                    [0,0,0,0],
                                    [1,1,1,1],
                                    [0,0,0,0],
                                    [0,0,0,0]
                                ];
                                break;
                case 'J':
                    figure.blocks=[ [0,0,0,0],
                                    [7,7,7,0],
                                    [0,0,7,0],
                                    [0,0,0,0]
                                 ];
                                 break;
                case 'L':
                    figure.blocks=[ [0,0,0,0],
                                    [2,2,2,0],
                                    [2,0,0,0],
                                    [0,0,0,0]
                                ];
                                break;
                case 'O':
                    figure.blocks=[ [0,0,0,0],
                                    [0,3,3,0],
                                    [0,3,3,0],
                                    [0,0,0,0]
                                ];
                                break;
                case 'S':
                    figure.blocks=[ [0,0,0,0],
                                    [0,4,4,0],
                                    [4,4,0,0],
                                    [0,0,0,0]
                                ];
                                break;
                case 'T':
                    figure.blocks=[[0,0,0,0],
                                    [5,5,5,0],
                                    [0,5,0,0],
                                    [0,0,0,0]
                                ];
                                break;
                case 'Z':
                    figure.blocks=[ [0,0,0,0],
                                    [6,6,0,0],
                                    [0,6,6,0],
                                    [0,0,0,0]
                            ];
                                 break;
                
            }
            figure.x=Math.floor((10-figure.blocks[0].length)/2);
            figure.y=-1;
            return figure;
        }

    moveFigureLeft(){
        this.activeFigure.x-=1;
        if(this.hasCollision()){
            this.activeFigure.x+=1;
        }
    
    }
    moveFigureRight(){
        this.activeFigure.x+=1;
        if(this.hasCollision()){
            this.activeFigure.x-=1;
        }
    
    }
    moveFigureDown(){
        if(this.gameOver){
            document.getElementById('gameover').style.display='block';
            
            setTimeout(() => {
                document.getElementById('gameover').style.display='none';
                document.getElementById('enter').style.display='block';
            }, 3000);
            
            return;
        }
    
        this.activeFigure.y+=1;
        if(this.hasCollision()){
            this.activeFigure.y-=1;
            this.lockPiece();
            const countLines= this.clearLines();
            this.updateScore(countLines);
            this.updateFigures();
            this.updateElems();
            
        
        }
        if(this.hasCollision()){
            this.gameOver=true;
            
        }
        
        
    }

    rotateFigure(){
        const blocks=this.activeFigure.blocks;
        const length=blocks.length;
        const result=[];
        for(let i=0; i<length; i++){
            result.push([]);
            for(let j=0; j<length;j++){
                    result[i][j]=blocks[length-j-1][i];
            }
        }
        this.activeFigure.blocks=result;
        if(this.hasCollision()){
            this.activeFigure.blocks=blocks;
        }
        
    }
    hasCollision(){
        
        
        const {y:pieceY,x:pieceX,blocks}=this.activeFigure;
        for(let y=0; y<blocks.length; y++){
            for(let x=0; x<blocks[y].length;x++){
                    if(blocks[y][x]&&
                        ((this.playfield[pieceY+y]===undefined|| this.playfield[pieceY+y][pieceX+x]===undefined)
                        ||this.playfield[pieceY+y][pieceX+x]))
                    
                        return true;
                    
            }
        }
        return false;
    }

    lockPiece(){
        const {y:pieceY,x: pieceX,blocks}=this.activeFigure;
        
        for(let y=0; y<blocks.length; y++){
            for(let x=0; x<blocks[y].length;x++){
                if(blocks[y][x]){
                    this.playfield[pieceY+y][pieceX+x]=blocks[y][x];
                }
            }
        }
        
    }

    clearLines(){

        const rows=20;
        const columns=10;
        let lines=[];
        for(let y = rows-1; y >= 0; y--){
            let number = 0;
            for(let x = 0; x < columns; x++){
                if(this.playfield[y][x]){
                    number++;
                }
                if(number === 0){
                    break;
                }
                else if(number < columns){
                    continue;
                }
                else if(number === columns){
                        lines.unshift(y);
                }
            }
        }
        for(let index of lines){
            this.playfield.splice(index,1);
            this.playfield.unshift(new Array(columns).fill(0));
        }
        return lines.length;
    }
    updateScore(clearedLines){
        
        if(clearedLines>0){
            this.score+=clearedLines*30*(this.level+1);
            this.lines+=clearedLines;
            //console.log(this.score,this.lines,this.level);
        }
    }
    
    
    updateElems(){
            let obj=this.getState();
            delete obj.playfield;
            let elements=document.querySelectorAll('p');
            let i=0;
            for(let text in obj){
                if(i===4){
                    break;
                }
                    if(text === 'nextFigure'){

                    elements[i++].innerHTML='Next:';


                    
                    }
            
                else
                    {
                    
                    elements[i++].innerHTML=`${text}: ${obj[text]}`;
                    
                }
            }
            let length = obj.nextFigure.blocks.length;
            const blocks = obj.nextFigure.blocks;
            for(let y=0; y<length ; y++){
                for(let x=0; x<length; x++){
                    let k=document.getElementById('__'+y+x);
                    if(blocks[y][x]){
                        k.style.cssText='outline: 1.5px solid black';
                        k.style.backgroundColor=this.colors[blocks[y][x]];
                       
                    }
                    else{
                        k.style.backgroundColor='black';
                    }

                }
            }
            
        
            
            
        }
        
        updateFigures(){
            this.activeFigure=this.nextFigure;
            this.nextFigure=this.createFigure();
        }

        getState(){
            const playfield=this.createPlayfield();
            
            for(let y=0; y<this.playfield.length; y++){
                playfield[y]=[];
                for(let x=0; x<this.playfield[y].length; x++){
                    playfield[y][x]=this.playfield[y][x];
                }
            }
    
            for(let y=0; y<this.activeFigure.blocks.length; y++){
                for(let x=0; x<this.activeFigure.blocks[y].length;x++){
                    if(this.activeFigure.blocks[y][x]){
                        playfield[this.activeFigure.y+y][this.activeFigure.x+x]=this.activeFigure.blocks[y][x];
                    }
                }
            }
            return {
                score: this.score,
                level: this.level,
                lines: this.lines,
                nextFigure: this.nextFigure,
                playfield,
                isGameOver:this.gameOver
            }
            
        }

}



