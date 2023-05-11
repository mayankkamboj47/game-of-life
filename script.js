const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 100;
const cellSize = canvas.width / gridSize;
let frameRate = 10;
let pause = false;

let grid = [];

function randomiseGrid(){
    for(let i=0; i<gridSize; i++) {
        grid[i] = [];
        for(let j=0; j<gridSize; j++) {
            grid[i][j] = Math.random() < 0.5 ? 0 : 1;
        }
    }
}

function gameLoop(){
    updateGrid();
    drawGrid();
    if(!pause) setTimeout(gameLoop, 1000 / frameRate);
}

function updateGrid(){
    let newGrid = [];
    for(let i=0; i<gridSize; i++) {
        newGrid[i] = [];
        for(let j=0; j<gridSize; j++) {
            const cell = grid[i][j];
            const neighbours = countNeighbours(i, j);
            if(cell === 0 && neighbours === 3) {
                newGrid[i][j] = 1;
            } else if(cell === 1 && (neighbours < 2 || neighbours > 3)) {
                newGrid[i][j] = 0;
            } else {
                newGrid[i][j] = cell;
            }
        }
    }
    grid = newGrid;
}

canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const coefficient = canvas.width / rect.width;
    const x = Math.floor((e.clientX - rect.left) * coefficient / cellSize);
    const y = Math.floor((e.clientY - rect.top) * coefficient / cellSize);
    grid[x][y] = grid[x][y] === 1 ? 0 : 1;
    drawGrid();
});


function countNeighbours(x, y) {
    let neighbours = 0;
    for(let i=-1; i<=1; i++) {
        for(let j=-1; j<=1; j++) {
            if(i === 0 && j === 0) continue;
            const x1 = x + i;
            const y1 = y + j;
            if(x1 < 0 || x1 >= gridSize || y1 < 0 || y1 >= gridSize) continue;
            if(grid[x1][y1] === 1) neighbours++;
        }
    }
    return neighbours;
}

function drawGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i<gridSize; i++) {
        for(let j=0; j<gridSize; j++) {
            const cell = grid[i][j];
            if(cell === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Start the game
randomiseGrid();   // pick a random grid
gameLoop();        // and begin the simulation


function elt(name, attributes, children) {
    let node = document.createElement(name);
    if (attributes) {
        for (let attr in attributes)
            if (attributes.hasOwnProperty(attr))
                node.setAttribute(attr, attributes[attr]);
    }
    for (let i = 2; i < arguments.length; i++) {
        let child = arguments[i];
        if (typeof child == "string")
            child = document.createTextNode(child);
        node.appendChild(child);
    }
    return node;
}

(
    function () {
        const label = elt("label", null, elt("span", null, "Frame Rate"));
        const slider = elt("input", {type: "range", min: 1, max: 60, value: 10, step: 1});
        const span = elt("span", null, slider.value);
        label.appendChild(slider);
        label.appendChild(span);
        document.body.appendChild(label);
        slider.addEventListener("change", function(e) {
            frameRate = e.target.value;  
            span.textContent = frameRate;
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Pause"));
        const checkbox = elt("input", {type: "checkbox"});
        label.appendChild(checkbox);
        document.body.appendChild(label);
        checkbox.addEventListener("change", function(e) {
            if(!pause) pause = true;
            else {
                pause = false;
                gameLoop();
            }
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Clear"));
        const button = elt("button", null, "Clear");
        label.appendChild(button);
        document.body.appendChild(label);
        button.addEventListener("click", function(e) {
            for(let i=0; i<gridSize; i++) {
                for(let j=0; j<gridSize; j++) {
                    grid[i][j] = 0;
                }
            }
            drawGrid();
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Randomise"));
        const button = elt("button", null, "Random");
        label.appendChild(button);
        document.body.appendChild(label);
        button.addEventListener("click", function(e) {
            randomiseGrid();
            drawGrid();
        });
    }
)();