class CNode {
    constructor(size) {
        this.info = 0;
        this.pnext = null;
        this.currentRow = 0;

        // Create board as 2D array
        this.board = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => ' ')
        );
    }
}

class CList {
    constructor() {
        this.phead = null;
        this.ptail = null;
    }

    attach(node) {
        if (!this.phead) {
            this.phead = node;
            this.ptail = node;
        } else {
            this.ptail.pnext = node;
            this.ptail = node;
        }
        node.pnext = null;
    }

    display() {
        let trav = this.phead;
        let output = [];
        while (trav) {
            output.push(trav.info);
            trav = trav.pnext;
        }
        console.log(output.join(" "));
    }
}

class CStack {
    constructor() {
        this.phead = null;
    }

    push(node) {
        node.pnext = this.phead;
        this.phead = node;
    }

    pop() {
        if (!this.phead) return null;
        let node = this.phead;
        this.phead = this.phead.pnext;
        node.pnext = null;
        return node;
    }
}

function copyNode(dest, src, n) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            dest.board[i][j] = src.board[i][j];
        }
    }
    dest.currentRow = src.currentRow;
}

function addQueenAt(col, node) {
    node.board[node.currentRow][col] = 'Q';
    node.currentRow++;
}

function isLegal(node, n) {
    let row = node.currentRow - 1;
    let col = -1;

    // Find column of the queen placed in this row
    for (let j = 0; j < n; j++) {
        if (node.board[row][j] === 'Q') {
            col = j;
            break;
        }
    }

    // Check same column
    for (let i = 0; i < row; i++) {
        if (node.board[i][col] === 'Q') return false;
    }

    // Check left diagonal
    let j = col - 1;
    for (let i = row - 1; i >= 0 && j >= 0; i--, j--) {
        if (node.board[i][j] === 'Q') return false;
    }

    // Check right diagonal
    j = col + 1;
    for (let i = row - 1; i >= 0 && j < n; i--, j++) {
        if (node.board[i][j] === 'Q') return false;
    }

    return true;
}

function createInit(size) {
    return new CNode(size);
}

function displaySolution(node, n, solutionNumber) {
    const grid = document.getElementById("solutions");
    const solutionDiv = document.createElement("div");
    solutionDiv.innerHTML = `<h3>Solution ${solutionNumber}:</h3>`;
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            cell.style.width = "30px";
            cell.style.height = "30px";
            cell.style.textAlign = "center";
            cell.style.border = "1px solid black";
            cell.style.fontSize = "24px";
            if(node.board[i][j] === 'Q') {
                cell.innerHTML = "&#9819;"; 
                cell.classList.add("queen");
            } else {
                cell.innerHTML = "";
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    solutionDiv.appendChild(table);
    grid.appendChild(solutionDiv);
}

const sleep = (ms) =>{
 return new Promise((r) => setTimeout(r, ms));
}

async function solveNQueens(n) {

    let stack = new CStack();
    let init = createInit(n);
    stack.push(init);

    let currentSolution = 1;
    let iterations = 0;

    await sleep(0);

    while (true) {
        let curr = stack.pop();
        if (!curr) break;

        for (let i = 0; i < n; i++) {
            let node = new CNode(n);
            copyNode(node, curr, n);
            addQueenAt(i, node);

            if (isLegal(node, n)) {
                if (node.currentRow === n) {
                    displaySolution(node, n, currentSolution);
                    currentSolution++;
                    await sleep(0);
                } else {
                    stack.push(node);
                }
            }
        }

        iterations++;
        if (iterations % 500 === 0) {
            await sleep(0);
        }
        document.getElementById("numSolutions").innerText = `Calculating... Solutions found: ${currentSolution - 1}`;

    }

    document.getElementById("loading").style.display = "none";   
    document.getElementById("numSolutions").innerText = `Total Solutions: ${currentSolution - 1}`;
}

let previousNum = null;
document.getElementById("solveButton").addEventListener("click", () => {
    const n = parseInt(document.getElementById("nValue").value);
    if(isNaN(n) || n <= 0){
        alert("Please enter a valid positive integer for N.");
        return;
    }
    if(n === previousNum){
        alert("Please enter a different value of N than the previous one.");
        return;
    }
    if(n < 4){
        alert("Please enter a value of N greater than or equal to 4.");
        return;
    }
    if (n >= 10) {
        const proceed = confirm(
            "Warning: Large N values may take considerable time to compute. Do you want to proceed? (Yes = proceed, No = cancel)"
        );
        if (!proceed) {
            return;
        }
    }
    document.getElementById("solutions").innerHTML = "";
    document.getElementById("numSolutions").innerText = "Calculating...";
    previousNum = n;
    document.getElementById("loading").style.display = "flex";
    solveNQueens(n); 
});

document.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        document.getElementById("solveButton").click();
    }
});
