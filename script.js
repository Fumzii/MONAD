const startingMinutes =  10;
let time = startingMinutes * 60;

const countdownEl = document.getElementById('countdown');
const muteButton = document.getElementById('muteButton');

// Flag to track whether move sounds are enabled or disabled
let moveSoundsEnabled = true;

// Function to toggle move sounds status
function toggleMoveSounds() {
    moveSoundsEnabled = !moveSoundsEnabled;
    muteButton.textContent = moveSoundsEnabled ? 'Mute' : 'Unmute ';
}

// Event listener for the mute button
muteButton.addEventListener('click', toggleMoveSounds);



setInterval(updateCountdown, 1000);

function  updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
}
const GameDifficulty=[20,50,70];
class Game{
    difficulty;//difficulty based on GameDifficulty array
    cols=3;//how many colomns
    rows=3;//how many rows
    count;//cols*rows
    blocks;//the html elements with className="puzzle_block"
    emptyBlockCoords=[2,2];//the coordinates of the empty block
    indexes=[];//keeps track of the order of the blocks

   

    constructor(difficultyLevel=1){
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.count=this.cols*this.rows;
        this.blocks=document.getElementsByClassName("puzzle_block");//grab the blocks
        this.init();
    }

    init(){//position each block in its proper position
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let blockIdx=x+y*this.cols;
                if(blockIdx+1>=this.count)break;
                let block=this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx,x,y);
                block.addEventListener('click',(e)=>this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count-1);
        this.randomize(this.difficulty);
    }

    randomize(iterationCount){//move a random block (x iterationCount)
        for(let i=0;i<iterationCount;i++){
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1));
            let moved=this.moveBlock(randomBlockIdx);
            if(!moved)i--;
        }
    }

    playMoveSound() {
        const moveSound = document.getElementById('moveSound');
        moveSound.play();
    }
    playPuzzleSolvedSound() {
        const puzzleSolvedSound = document.getElementById('puzzleSolvedSound');
        puzzleSolvedSound.play();
    }
    moveBlock(blockIdx) {
        let block = this.blocks[blockIdx];
        let blockCoords = this.canMoveBlock(block);
        if (blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.emptyBlockCoords[0], this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
            this.emptyBlockCoords[0] = blockCoords[0];
            this.emptyBlockCoords[1] = blockCoords[1];

            // Play the move sound when a block is moved
            this.playMoveSound();

            return true;
        }
        return false;
    }

    playMoveSound() {
        if (moveSoundsEnabled) {
            const moveSound = document.getElementById('moveSound');
            moveSound.play();
        }
    }

    canMoveBlock(block){//return the block coordinates if he can move else return null
        let blockPos=[parseInt(block.style.left),parseInt(block.style.top)];
        let blockWidth=block.clientWidth;
        let blockCoords=[blockPos[0]/blockWidth,blockPos[1]/blockWidth];
        let diff=[Math.abs(blockCoords[0]-this.emptyBlockCoords[0]),Math.abs(blockCoords[1]-this.emptyBlockCoords[1])];
        let canMove=(diff[0]==1&&diff[1]==0)||(diff[0]==0&&diff[1]==1);
        if(canMove)return blockCoords;
        else return null;
    }

    positionBlockAtCoord(blockIdx,x,y){//position the block at a certain coordinates
        let block=this.blocks[blockIdx];
        block.style.left=(x*block.clientWidth)+"px";
        block.style.top=(y*block.clientWidth)+"px";
    }

    onClickOnBlock(blockIdx){//try move block and check if puzzle was solved
        if(this.moveBlock(blockIdx)){
            if(this.checkPuzzleSolved()){
                setTimeout(()=>alert("True monad found🎇🎆🎇🎉🎉"),600);
            }
        }
    } 

    checkPuzzleSolved(){//return if puzzle was solved
        for(let i=0;i<this.indexes.length;i++){
            //console.log(this.indexes[i],i);
            if(i==this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols)continue;
            if(this.indexes[i]!=i)return false;
        }
        // Puzzle is solved, play the sound
        this.playPuzzleSolvedSound();
        return true;
    }

    setDifficulty(difficultyLevel){//set difficulty
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty);

    // Play the sound when the difficulty changes
    playDifficultyChangeSound();
}

}
function playDifficultyChangeSound() {
    const difficultyChangeSound = document.getElementById('difficultyChangeSound');
    difficultyChangeSound.play();
}
var game=new Game(1);//instantiate a new Game


//taking care of the difficulty buttons
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem,idx)=>{
    elem.addEventListener('click',(e)=>{
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active");
        elem.classList.add("active");
        game.setDifficulty(idx+1);
    });
});