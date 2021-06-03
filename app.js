document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombsAmmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  
  //create board
  function createBoard() {
    //get shuffled game array with random blocks
	const bombsArray = Array(bombsAmmount).fill("bomb");
    const emptyArray = Array(width * width - bombsAmmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener("click", (e) => {
        click(square);
      });

      //cntrl and left click
      square.oncontextmenu = (e) => {
        e.preventDefault();
        addFlag(square);
      };
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width == 0;
      const isRightEdge = i % width == width - 1;

      if (squares[i].classList.contains("valid")) {
        //West
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        //East
        if (
          i < width * width - 1 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        )
          total++;
        //North
        if (i > width && squares[i - width].classList.contains("bomb")) total++;
        //North-East
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        //North-West
        if (
          i > width + 1 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        //South
        if (
          i < width * width - width &&
          squares[i + width].classList.contains("bomb")
        )
          total++;
        //South-East
        if (
          i < width * width - width &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        //South-West
        if (
          i < width * width - width &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;

        squares[i].setAttribute("data", total);
      }
    }
  }

  createBoard();
  
  //restart the game
  function restartGame() {
	const gameButton = document.querySelector(".gameButton");
	gameButton.addEventListener("click", () => {
		window.location.reload();
	});
  }
  
  restartGame();

  //add Flag with Right Click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombsAmmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "F";
        flags++;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
      }
    }
  }

  //click on square actions
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  //check neighbouring squares once square is checked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width == 0;
    const isRightEdge = currentId % width == width - 1;

    setTimeout(() => {
      //West
      if (currentId > 0 && !isLeftEdge) {
        newSquareClick(currentId, -1);
      }
      //East
      if (currentId < width * width - 1 && !isRightEdge) {
        newSquareClick(currentId, 1);
      }
      //North
      if (currentId > width - 1) {
        newSquareClick(currentId, -width);
      }
      //North-East
      if (currentId > width - 1 && !isRightEdge) {
        newSquareClick(currentId, 1 - width);
      }
      //North-West
      if (currentId > width - 1 && !isLeftEdge) {
        newSquareClick(currentId, -(1 + width));
      }
      //South
      if (currentId < width * width - width) {
        newSquareClick(currentId, width);
      }
      //South-East
      if (currentId < width * width - width && !isRightEdge) {
        newSquareClick(currentId, 1 + width);
      }
      //South-West
      if (currentId < width * width - width && !isLeftEdge) {
        newSquareClick(currentId, width - 1);
      }
    }, 10);
  }

  function newSquareClick(currentId, value) {
    const newId = squares[parseInt(currentId) + value].id;
    const newSquare = document.getElementById(newId);
    click(newSquare);
  }

  //game Over
  function gameOver(square) {
    isGameOver = true;

    //show all bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "B";
      }
    });
    const gameOver = document.querySelector(".gameOver");
    gameOver.classList.remove("hidden");
  }

  //check for win
  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches == bombsAmmount) {
        isGameOver = true;
        const gameOver = document.querySelector(".gameOver");
        const gameStatus = document.querySelector(".gameStatus");
        gameStatus.innerHTML = "You Won";
        gameOver.classList.remove("hidden");
      }
    }
  }
});
