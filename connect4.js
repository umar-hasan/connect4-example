/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(height, width, firstPlayer, secondPlayer) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.board = [];
    this.currPlayer = firstPlayer;
    this.player1 = firstPlayer
    this.player2 = secondPlayer
    this.gameSet = 0;
    this.makeBoard();
    this.makeHtmlBoard();
    console.log(this.player1)
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    const clickFunction = this.handleClick.bind(this);
    top.addEventListener("click", clickFunction);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer.getPlayer()}`);
    piece.style.backgroundColor = this.currPlayer.getPlayer()
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (this.gameSet === 0) {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      console.log(this);
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.gameSet = 1
        if (this.currPlayer === this.player1) {
          return this.endGame("1P wins!");
        }
        else if (this.currPlayer === this.player2) {
          return this.endGame("2P wins!");
        }
      }

      // check for tie
      if (this.board.every((row) => row.every((cell) => cell))) {
        this.gameSet = 1
        return this.endGame("Tie!");
      }

      // switch players
      this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match this.currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color
  }
  getPlayer() {
    return this.color
  }
}

// active player: 1 or 2
// array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
const colorForm = document.getElementById("color-form")
const startBtn = document.getElementById("start-game")
const restartBtn = document.getElementById("restart-game")

restartBtn.style.display = "none"

startBtn.addEventListener("click", startNewGame)
restartBtn.addEventListener("click", restartGame)

function startNewGame(e) {
  e.preventDefault()
  let p1 = new Player(document.getElementById("p1-color").value)
  let p2 = new Player(document.getElementById("p2-color").value)
  colorForm.style.display = "none"
  startBtn.style.display = "none"
  restartBtn.style.display = "block"
  new Game(6, 7, p1, p2);
}

function restartGame(e) {
  document.getElementById("board").innerHTML = ""
  colorForm.style.display = "block"
  startBtn.style.display = "block"
  restartBtn.style.display = "none"
}

