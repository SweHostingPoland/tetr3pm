import MusicTempo from "https://cdn.jsdelivr.net/npm/music-tempo/+esm";

const shapes = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ]
];

const colors = ["#2a2a2a", "#9b5fe0", "#16a4d8", "#60dbe8", "#8bd346", "#efdf48", "#f9a52c", "#d64e12"];
const rows = 20;
const cols = 10;

const githubBtn = document.getElementById("github");
const githubLink = "https://github.com/Lolo280374/tetrmp3"
const keybindsBtn = document.getElementById("keybinds");
const fileInput = document.getElementById("fileInput");
const demoInput = document.getElementById("demoInput");
const scoreElement = document.querySelector(".scoreEl");
const gameCanvasDiv = document.querySelector(".gameDiv");

const sfx_movement = document.getElementById("sfx_movement");
const sfx_shapePlaced = document.getElementById("sfx_shapePlaced");
const sfx_lineDelete = document.getElementById("sfx_lineDelete");
const sfx_gameOver = document.getElementById("sfx_gameOver");

let canvas = document.querySelector("#gameEl");
let scoreboard = document.querySelector("h2");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);

let shapeObj = null;
let grid = generateGrid();
let score = 0;
let currentBPM = 120;
let bpmAnalysisInterval = null;
let currentAudioBuffer = null;
let displayInterval = null;

lucide.createIcons();

if (githubBtn){
    githubBtn.addEventListener("click", (e) => {
        githubBtn.blur();
        window.open(githubLink, "_blank", "noopener");
    });
}

if (keybindsBtn){
    keybindsBtn.addEventListener("click", (e) => {
        keybindsBtn.blur();
        alert(
            "keybinds for the game:\n" +
            "left/right/down arrows - moves the active shape\n" +
            "up arrow - rotates the active shape\n" +
            "spacebar - instantly slam the active shape to the bottom, and go to the next shape\n" +
            "i'll add more later ig"
        );
        canvas.focus();
    });
}

const demoSongsPool = [
    { path: "https://tetr.lolodotzip.tech/demo/demo_mikopbx.mp3" },
    { path: "https://tetr.lolodotzip.tech/demo/demo_ncs.mp3" }
];

if (demoInput){
    demoInput.addEventListener("click", (e) => {
        const random = Math.floor(Math.random() * demoSongsPool.length);
        const selected = demoSongsPool[random];
        startAfterImport(selected.path);
    });
}

if (fileInput){
    fileInput.addEventListener("change", (e) => {
        const importedFile = e.target.files[0];
        if (importedFile){
            const extension = importedFile.name.split(".").pop().toLowerCase();
            if (!['mp3', 'ogg', 'wav', 'aac', 'm4a', 'flac'].includes(extension)){
                alert("imported file's extension may not be compatible. audio playback is not assured!");
            }
            const fileURL = URL.createObjectURL(importedFile);
            startAfterImport(fileURL);
        }
    });
}

function startAfterImport(songPath){
    document.querySelector(".mainselect").style.display = "none";
    document.querySelector("header").style.display = "none";
    scoreElement.classList.add("show");
    gameCanvasDiv.classList.add("show");

    if (gameAudio){
        gameAudio.pause();
        gameAudio.currentTime = 0;
    }

    BPMAnalysisandPlay(songPath);
}

async function BPMAnalysisandPlay(songPath){
    try {
        const audioBuffer = await getAudioBuffer(songPath);
        const audioData = audioBuffer.getChannelData(0);
        const mt = new MusicTempo(audioData);
        const bpm = mt.tempo;

        startwithBPM(songPath, bpm, audioBuffer);
    } catch (err){
        startwithBPM(songPath, 120, null);
    }
}

async function getAudioBuffer(audioPath){
    const response = await fetch(audioPath);
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function startwithBPM(songPath, bpm, audioBuffer){
    currentBPM = bpm;
    currentAudioBuffer = audioBuffer;
    const interval = 60000 / bpm;

    gameAudio = new Audio();
    gameAudio.src = songPath;
    gameAudio.loop = true;
    gameAudio.addEventListener("canplay", () => gameAudio.play().catch(err => console.error("couldn't play the song: ", err)));
    gameAudio.load();

    shapeObj = null;
    grid = generateGrid();
    score = 0;
    gameOver = false;
    timeElapsed = Date.now();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(newGameState, interval);
    canvas.focus();

    if (displayInterval) clearInterval(displayInterval);
    displayInterval = setInterval(() => {
        if (gameOver) clearInterval(displayInterval);
        const elapsedMs = Date.now() - timeElapsed;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        scoreboard.innerHTML = score + " points — " + Math.round(currentBPM) + " BPM — " + minutes + " mins " + seconds + " secs elapsed";
    }, 100);

    if (bpmAnalysisInterval) clearInterval(bpmAnalysisInterval);
    bpmAnalysisInterval = setInterval(async () => {
        if (gameAudio && !gameOver && currentAudioBuffer) {
            try {
                const currentTime = gameAudio.currentTime;
                if (currentTime < 5) return;

                const sampleRate = currentAudioBuffer.sampleRate;
                const startSample = Math.floor(currentTime * sampleRate);
                const chunkSize = sampleRate * 5;
                const endSample = Math.min(startSample + chunkSize, currentAudioBuffer.length);
                const audioData = currentAudioBuffer.getChannelData(0);
                const chunk = audioData.slice(startSample, endSample);

                if (chunk.length > sampleRate * 3){
                    const mt = new MusicTempo(chunk);
                    const updatedBPM = mt.tempo;

                    if (Math.abs(updatedBPM - currentBPM) > 5){
                        currentBPM = updatedBPM;
                        const updatedInterval = 60000 / updatedBPM;

                        if (gameInterval) clearInterval(gameInterval);
                        gameInterval = setInterval(newGameState, updatedInterval);
                    }
                }
            } catch (err) {
                console.error("an error has occured during the BPM analysis. the song might be corrupted?");
            }
        }
    }, 3000);
}

function randomShape(){
    let random = Math.floor(Math.random()*7);
    let shape = shapes[random];
    let color = random+1;
    let x = 5;
    let y = 0
    return {shape,x,y,color}
}

let gameInterval = null;
let gameOver = false;
let gameAudio = null;
let timeElapsed = 0;

function newGameState(){
    if (gameOver) return;
    checkGrid();
    if(shapeObj == null){
        shapeObj = randomShape();
        renderShape();
    }
    gravity();
}

function renderShape(){
    if (!shapeObj) return;
    let shape = shapeObj.shape;
    for(let i=0;i<shape.length;i++){
        for (let j=0;j<shape[i].length;j++){
            if (shape[i][j] == 1){
                ctx.fillStyle = "#0d0d0d";
                ctx.fillRect(shapeObj.x+j,shapeObj.y+i,1,1);
                ctx.fillStyle = colors[shapeObj.color];
                ctx.fillRect(shapeObj.x+j+0.1,shapeObj.y+i+0.1,0.8,0.8);
            }
        }
    }
}

function left(){
    if (!shapeObj) return;
    if (!collision(shapeObj.x-1,shapeObj.y))
        shapeObj.x-=1;
        sfx_movement.currentTime = 0;
        sfx_movement.play();
    renderGrid();
}

function right(){
    if (!shapeObj) return;
    if (!collision(shapeObj.x+1,shapeObj.y))
        shapeObj.x+=1;
        sfx_movement.currentTime = 0;
        sfx_movement.play();
    renderGrid();
}

function rotate(){
    if (!shapeObj) return;
    let rotatedShape = [];
    let shape = shapeObj.shape;

    sfx_movement.currentTime = 0;
    sfx_movement.play();

    for (let i=0;i<shape.length;i++){
        rotatedShape.push([]);
        for (let j=0;j<shape[i].length;j++){
            rotatedShape[i].push(0);
        }
    }

    for (let i=0;i<shape.length;i++){
        for (let j=0;j<shape[i].length;j++){
            rotatedShape[i][j] = shape[j][i]
        }
    }

    for (let i=0;i<rotatedShape.length;i++){
        rotatedShape[i] = rotatedShape[i].reverse();
    }

    if (!collision(shapeObj.x,shapeObj.y,rotatedShape))
        shapeObj.shape = rotatedShape
    renderGrid();
}

function collision(x, y, rotatedShape){
    let shape = rotatedShape || shapeObj.shape;
    for (let i=0;i<shape.length;i++){
        for (let j=0;j<shape[i].length;j++){
            if(shape[i][j] == 1){
                let p = x+j;
                let q = y+i;
                if (p>=0 && p<cols && q>=0 && q<rows){
                    if (grid[q][p]>0){
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

function gravity(){
    if (!shapeObj) return;
    if (!collision(shapeObj.x,shapeObj.y+1))
        shapeObj.y+=1;
    else {
        for (let i=0;i<shapeObj.shape.length;i++){
            for (let j=0;j<shapeObj.shape[i].length;j++){
                if (shapeObj.shape[i][j] == 1){
                    let p = shapeObj.x+j
                    let q = shapeObj.y+i;
                    grid[q][p] = shapeObj.color;
                }
            }
        }

        sfx_shapePlaced.currentTime = 0;
        sfx_shapePlaced.play();

        if (shapeObj.y == 0){
            gameOver = true;
            clearInterval(gameInterval);
            sfx_gameOver.currentTime = 0;
            sfx_gameOver.play();
            alert("game over... (the next shape was going to be too big for the remaining space)");
            score = 0;
            window.location.href = "https://tetr.lolodotzip.tech/";
            return;
        }
        shapeObj = null;
    }
    renderGrid();
}

function skipGravity(){
    if (!shapeObj) return;
    while (!collision(shapeObj.x, shapeObj.y + 1)){
        shapeObj.y += 1;
    }
    gravity();
    renderGrid();
}

function generateGrid(){
    let grid = [];
    for (let i=0;i<rows;i++){
        grid.push([]);
        for(let j=0;j<cols;j++){
            grid[i].push(0);
        }
    }
    return grid;
}

function checkGrid(){
    let count = 0;
    for (let i=0;i<grid.length;i++){
        let isFilled = true;
        for (let j=0;j<grid[i].length;j++){
            if(grid[i][j] == 0){
                isFilled = false;
            }
        }
        if (isFilled){
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
            count++;
            sfx_lineDelete.currentTime = 0;
            sfx_lineDelete.play();
        }
    }

    if(count == 1){
        score+=10;
    } else if(count == 2){
        score+=30;
    } else if(count == 3){
        score+=50;
    } else if(count>3){
        score+=100;
    }
}

function renderGrid(){
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0,0,cols,rows);

    for (let i=0;i<grid.length;i++){
        for (let j=0;j<grid[i].length;j++){
            if (grid[i][j] > 0){
                ctx.fillStyle = "#0d0d0d";
                ctx.fillRect(j,i,1,1);
                ctx.fillStyle = colors[grid[i][j]];
                ctx.fillRect(j+0.1,i+0.1,0.8,0.8);
            }
        }
    }
    renderShape();
}

document.addEventListener("keydown", function(e) {
    let key = e.code;
    if(key == "ArrowDown"){
        sfx_movement.currentTime = 0;
        sfx_movement.play();
        gravity();
    } else if (key == "ArrowLeft"){
        left();
    } else if (key == "ArrowRight"){
        right();
    } else if (key == "ArrowUp"){
        rotate();
    } else if (key == "Space"){
        skipGravity();
    }
})