const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let gridSize = 100;
let cellSize = canvas.width / gridSize;
let xOffset = 0;
let yOffset = 0;
let frameRate = 10;
let pause = false;
let theme = "dark";
let generation = 0;
let grid = [];

function randomiseGrid(seed) {
    // create a random grid of 1s and 0s of size gridSize x gridSize
    // We essentially use a linear congruential generator (LCG) to generate a random number
    // See a simpler example on : https://www.github.com/mayankkamboj47/numtheory
    if (seed === undefined) seed = Math.floor(Math.random() * (1 << 48));
    const multiplier = 0x5DEECE66D;
    const mask = (1 << 48) - 1;
    let random = seed;
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            random = (multiplier * random + 0xB) & mask;
            grid[i][j] = Math.floor(random / (1 << (48 - 1))) % 2;
        }
    }
}

function gameLoop() {
    generation++;
    updateGrid();
    drawGrid();
    if (!pause) setTimeout(gameLoop, 1000 / frameRate);
}

function updateGrid() {
    let newGrid = [];
    for (let i = 0; i < gridSize; i++) {
        newGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            try {
                const cell = grid[i][j];
                const neighbours = countNeighbours(i, j);
                if (cell === 0 && neighbours === 3) {
                    newGrid[i][j] = 1;
                } else if (cell === 1 && (neighbours < 2 || neighbours > 3)) {
                    newGrid[i][j] = 0;
                } else {
                    newGrid[i][j] = cell;
                }
            } catch (e) {
                if (e instanceof TypeError) newGrid[i][j] = 0;
                else throw e;
            }
        }
    }
    grid = newGrid;
}

function resizeGrid(size) {
    gridSize = size;
    cellSize = canvas.width / gridSize;
    updateGrid();
    drawGrid();
}

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const coefficient = canvas.width / rect.width;
    const x = Math.floor((e.clientX - rect.left) * coefficient / cellSize);
    const y = Math.floor((e.clientY - rect.top) * coefficient / cellSize);
    grid[x + xOffset][y + yOffset] = (grid[x + xOffset] || [])[y + yOffset] === 1 ? 0 : 1;
    drawGrid();
});

canvas.addEventListener("mousedown", function (e) {
    const onMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const coefficient = canvas.width / rect.width;
        const x = Math.floor((e.clientX - rect.left) * coefficient / cellSize) + xOffset;
        const y = Math.floor((e.clientY - rect.top) * coefficient / cellSize) + yOffset;
        grid[x][y] = 1;
        drawGrid();
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", function () {
        canvas.removeEventListener("mousemove", onMove);
    });
});

function countNeighbours(x, y) {
    let neighbours = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const x1 = x + i;
            const y1 = y + j;
            if (x1 < 0 || x1 >= gridSize || y1 < 0 || y1 >= gridSize) continue;
            if (grid[x1][y1] === 1) neighbours++;
        }
    }
    return neighbours;
}

function drawGrid() {
    if (theme === "light") ctx.fillStyle = "white";
    else ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = grid[i + xOffset] ? grid[i + xOffset][j + yOffset] : undefined;
            if (cell === 1) {
                if (theme === "light") ctx.fillStyle = "black";
                else ctx.fillStyle = "white";
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

function clearGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            try {
                grid[i][j] = 0;
            }
            catch {
                console.log(grid, i, j);
            }
        }
    }
    generation = 0;
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
        const label = elt("label", null, elt("span", null, "Grid Size"));
        const slider = elt("input", { type: "range", min: 100, max: 500, value: 100, step: 1 });
        label.appendChild(slider);
        document.body.appendChild(label);
        slider.addEventListener("change", function (e) {
            resizeGrid(e.target.value);
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "X offset"));
        const slider = elt("input", { type: "range", min: 0, max: 100, value: 0, step: 1 });
        label.appendChild(slider);
        document.body.appendChild(label);
        slider.addEventListener("change", function (e) {
            xOffset = parseInt(e.target.value);
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Y offset"));
        const slider = elt("input", { type: "range", min: 0, max: 100, value: 0, step: 1 });
        label.appendChild(slider);
        document.body.appendChild(label);
        slider.addEventListener("change", function (e) {
            yOffset = parseInt(e.target.value);
        });
    }
)();
(
    function () {
        const label = elt("label", null, elt("span", null, "Frame Rate"));
        const slider = elt("input", { type: "range", min: 1, max: 60, value: 10, step: 1 });
        label.appendChild(slider);
        document.body.appendChild(label);
        slider.addEventListener("change", function (e) {
            frameRate = e.target.value;
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Pause"));
        const checkbox = elt("input", { type: "checkbox" });
        label.appendChild(checkbox);
        document.body.appendChild(label);
        checkbox.addEventListener("change", function (e) {
            if (!pause) pause = true;
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
        button.addEventListener("click", function (e) {
            clearGrid();
            drawGrid();
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Randomise"));
        const button = elt("button", null, "Random");
        const seed = elt("input", { type: "text", value: "1331", placeholder: "seed" });
        label.appendChild(seed);
        label.appendChild(button);
        document.body.appendChild(label);
        button.addEventListener("click", function (e) {
            randomiseGrid(seed.value);
            seed.value = Math.floor(Math.random() * 10000);
            drawGrid();
        }
        );
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Theme"));
        const button = elt("button", null, "Toggle");
        label.appendChild(button);
        document.body.appendChild(label);
        button.addEventListener("click", function (e) {
            if (theme === "light") theme = "dark";
            else theme = "light";
            drawGrid();
            document.querySelector("body").classList.toggle("dark");
        });
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Download the grid"));
        const button = elt("button", null, "Download");
        label.appendChild(button);
        document.body.appendChild(label);
        button.addEventListener("click", function (e) {
            // download the grid as a json file
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grid));
            const dlAnchorElem = elt('a', { href: dataStr, download: 'grid.json' });
            document.body.appendChild(dlAnchorElem);
            dlAnchorElem.click();
            dlAnchorElem.remove();
        });
    }
)();

(
    function () {
        const label = elt("label", { class: "upload" }, elt("span", null, "Upload a grid"));
        const input = elt("input", { type: "file" });
        label.appendChild(input);
        document.body.appendChild(label);
        input.addEventListener("change", function (e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                grid = JSON.parse(contents);
                gridSize = grid.length;
                cellSize = canvas.width / gridSize;
                drawGrid();
            };
            reader.readAsText(file);
        }
        );
    }
)();

(
    function () {
        const label = elt("label", null, elt("span", null, "Presets"));
        const select = elt("select", null);
        const options = [
            { name: "Glider", value: "glider" },
            { name: "Glider Gun", value: "gliderGun" },
            { name: "Beacon", value: "beacon" },
        ];
        const presetGrids = {
            glider: [
                "...#.",
                ".#.#.",
                "..##.",
            ].map(line => [...line].map(char => char === "#" ? 1 : 0)),
            beacon: [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 1, 1],
                [0, 0, 1, 1]
            ],
            gliderGun : [
            "........................#...........",
            "......................#.#...........",
            "............##......##............##",
            "...........#...#....##............##",
            "##........#.....#...##..............",
            "##........#...#.##....#.#...........",
            "..........#.....#.......#...........",
            "...........#...#....................",
            "............##......................",
            ].map(line => [...line].map(char => char === "#" ? 1 : 0)),
        };
        options.forEach(function (option) {
            const opt = elt("option", { value: option.value }, option.name);
            select.appendChild(opt);
        }
        );
        label.appendChild(select);
        document.body.appendChild(label);
        select.addEventListener("change", function (e) {
            const preset = e.target.value;
            newGrid = presetGrids[preset].slice();
            clearGrid();
            // put the preset in the middle of the grid
            const offset = Math.floor((gridSize - newGrid.length) / 4);
            for (let i = 0; i < newGrid.length; i++) {
                for (let j = 0; j < newGrid[0].length; j++) {
                    grid[i + offset][j + offset] = newGrid[i][j];
                }
            }
            drawGrid();
        });
    })();

