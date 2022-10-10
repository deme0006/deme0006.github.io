const allElements = document.querySelectorAll('*'),
  header = document.querySelector('.header'),
  flagCounter = document.querySelector('.flag-counter'),
  levels = document.querySelectorAll('.level'),
  level = document.querySelector('#current-level'),
  buttonRestart = document.querySelector('#restart'),
  cells = document.querySelector('.cells'),
  difficulties = [
    {rows: 8, columns: 12, bombs: 10},
    {rows: 9, columns: 14, bombs: 15},
    {rows: 10, columns: 16, bombs: 25},
    {rows: 11, columns: 18, bombs: 40},
    {rows: 12, columns: 20, bombs: 50},
    {rows: 13, columns: 22, bombs: 65},
    {rows: 14, columns: 24, bombs: 80},
    {rows: 15, columns: 26, bombs: 100}
  ];


function Main() {
  let difficulty = difficulties[localStorage.getItem('minesweeper_difficulty') ?? 0];
  let clickedCounter = 0;

  const rows = difficulty.rows;
  const columns = difficulty.columns;
  const arr = Array(columns * rows).fill(null);
  const bombs = [];
  const clicked = [];

  (function SetDefaults() {
    allElements.forEach(element => {
      element.style = null;
    });

    flagCounter.firstChild.textContent = clickedCounter;
    cells.innerHTML = null;
    cells.style = `grid-template-rows: repeat(${rows}, 1fr); grid-template-columns: repeat(${columns}, 1fr);`;

    [...Array(rows * columns)].forEach(_ => {
      const cell = document.createElement('button');
      cell.classList.add('cell');
      cells.appendChild(cell);
    });

    buttonRestart.classList = '';

    levels.forEach(level => {
      level.classList = 'level';
    });

  })();





  (function DisplayLevel() {
    levels.forEach((level, index) => {
      level.textContent = `${difficulties[index].bombs} bombs`;

      if (difficulties.indexOf(difficulty) === index) {
        level.style.display = 'none';
      }
    });

    level.firstChild.textContent = `${difficulty.bombs} bombs`;
  })();



  const GetRandomBombPos = () => Math.floor((Math.random() * columns * rows));



  (function Bombs() {
    [...Array(difficulty.bombs)].forEach((_, index) => {
      let bombPosition = GetRandomBombPos();

      while (bombs.includes(bombPosition)) {
        bombPosition = GetRandomBombPos();
      }

      bombs.push(bombPosition);
      arr[bombPosition] = 'b';
      cells.children[bombPosition].style.color = 'red';
    });

    flagCounter.lastChild.textContent = bombs.length;
  })();




  (function BombsNeighbours() {
    [...Array(rows * columns)].forEach((_, index) => {
      if (arr[index] !== 'b') {
        if (arr[index - columns - 1] === 'b' && index % columns !== 0) {
          arr[index] += 1
        }
        if (arr[index - columns] === 'b') {
          arr[index] += 1
        }
        if (arr[index - columns + 1] === 'b' && (index + 1) % columns !== 0) {
          arr[index] += 1
        }
        if (arr[index - 1] === 'b' && index % columns !== 0) {
          arr[index] += 1
        }
        if (arr[index + 1] === 'b' && (index + 1) % columns !== 0) {
          arr[index] += 1
        }
        if (arr[index + columns - 1] === 'b' && index % columns !== 0) {
          arr[index] += 1
        }
        if (arr[index + columns] === 'b') {
          arr[index] += 1
        }
        if (arr[index + columns + 1] === 'b' && (index + 1) % columns !== 0) {
          arr[index] += 1
        }
      }
    });
  })();





  function CheckWin() {
    if (clicked.length === arr.length - bombs.length && clickedCounter === bombs.length) {
      flagCounter.firstChild.textContent = bombs.length;

      bombs.forEach(bomb => {
        cells.children[bomb].style.transition = '3s ease-out';
        cells.children[bomb].style.background = '#9fd5ae url("images/flag-green.svg")';
        cells.children[bomb].style.backgroundSize = '55px';
        cells.children[bomb].style.backgroundPosition = '55% 25%';
      });

      [...cells.children].forEach((_, index) => {
        cells.children[index].style.cursor = 'not-allowed';
        cells.children[index].onclick = null;
        cells.children[index].oncontextmenu = null;
      });

      [...header.children].forEach((_, index) => {
        header.children[index].style = 'transition: 1s ease-in; border-color: #2cc740; color: #2cc740';
      });

      levels.forEach(level => {
        level.style.color = '#2cc740';
        level.parentNode.previousElementSibling.lastChild.style = 'transition: 1s ease-in; color: #2cc740';
      });

      setTimeout(() => {
        buttonRestart.style.transition = null;
      }, 1000);

      buttonRestart.classList.add('button-restart-green');

      levels.forEach(level => {
        level.classList.add('level-green');
      });
    }
  }





  function GameOver() {
    clickedCounter = 0;

    bombs.forEach(bomb => {
      if (cells.children[bomb].style.backgroundImage.includes('flag')) {
        clickedCounter++
      }
      cells.children[bomb].style = 'background: #d90000 url("images/bomb.svg") center center no-repeat; background-size: 150%; ';
    });

    flagCounter.firstChild.textContent = clickedCounter;

    [...cells.children].forEach((_, index) => {
      cells.children[index].classList.toggle('cell');
      cells.children[index].style.transition = '1s ease-in;';
      cells.children[index].style.cursor = 'not-allowed';
      cells.children[index].onclick = null;
      cells.children[index].oncontextmenu = null;

      if (cells.children[index].style.backgroundImage.includes('flag')) {
        cells.children[index].style.background = '#f6bd94 url("images/flag-orange.svg")';
        cells.children[index].style.backgroundSize = '55px';
        cells.children[index].style.backgroundPosition = '55% 25%';
      }
    });

    [...header.children].forEach((_, index) => {
      header.children[index].style = 'transition: 1s ease-in; border-color: red; color: red';
    });

    levels.forEach(level => {
      level.style.color = 'red';
      level.parentNode.previousElementSibling.lastChild.style = 'transition: 1s ease-in; color: red';
    });

    setTimeout(() => {
      buttonRestart.style.transition = null;
    }, 1000);

    buttonRestart.classList.add('button-restart-red');

    levels.forEach(level => {
      level.classList.add('level-red');
    });
  }





  (function GameLogic() {
  [...cells.children].forEach((_, index) => {
      cells.children[index].onclick = () => {
        if (!cells.children[index].style.background) {
          if (arr[index] === 'b') {
            cells.children[index].style.background = 'red url("images/bomb.svg") 0 no-repeat';
            GameOver();
          } else {
            cells.children[index].style.background = '#4e94f2';
            cells.children[index].textContent = arr[index];
            clicked.push(index);
          }

          cells.children[index].onmouseup = null;
          cells.children[index].oncontextmenu = null;
          cells.children[index].style.cursor = 'not-allowed';

          if (!arr[index]) {
            if (index % columns !== 0) {
              if (cells.children[index - 1].style.backgroundImage.includes('flag')) {
                cells.children[index - 1].style.background = null;
                clickedCounter--;
              }

              cells.children[index - 1].click();
            }

            if ((index + 1) % columns !== 0) {
              if (cells.children[index + 1].style.backgroundImage.includes('flag')) {
                cells.children[index + 1].style.background = null;
                clickedCounter--;
              }

              cells.children[index + 1].click();
            }

            if (cells.children[index - columns] !== undefined) {
              if (cells.children[index - columns].style.backgroundImage.includes('flag')) {
                cells.children[index - columns].style.background = null;
                clickedCounter--;
              }

              cells.children[index - columns].click();

              if (index % columns !== 0) {
                if (cells.children[index - columns - 1].style.backgroundImage.includes('flag')) {
                  cells.children[index - columns - 1].style.background = null;
                  clickedCounter--;
                }

                cells.children[index - columns - 1].click();
              }

              if ((index + 1) % columns !== 0) {
                if (cells.children[index - columns + 1].style.backgroundImage.includes('flag')) {
                  cells.children[index - columns + 1].style.background = null;
                  clickedCounter--;
                }

                cells.children[index - columns + 1].click();
              }
            }

            if (cells.children[index + columns] !== undefined) {
              if (cells.children[index + columns].style.backgroundImage.includes('flag')) {
                cells.children[index + columns].style.background = null;
                clickedCounter--;
              }

              cells.children[index + columns].click();

              if ((index + 1) % columns !== 0) {
                if (cells.children[index + columns + 1].style.backgroundImage.includes('flag')) {
                  cells.children[index + columns + 1].style.background = null;
                  clickedCounter--;
                }

                cells.children[index + columns + 1].click();
              }

              if (index % columns !== 0) {
                if (cells.children[index + columns - 1].style.backgroundImage.includes('flag')) {
                  cells.children[index + columns - 1].style.background = null;
                  clickedCounter--;
                }

                cells.children[index + columns - 1].click();
              }
            }
          }
        }

        CheckWin();
      }

      cells.children[index].oncontextmenu = () => {
        if (cells.children[index].style.background) {
          cells.children[index].style.backgroundPosition = '0 0';

          setTimeout(() => {
            cells.children[index].style.backgroundColor = null;
            cells.children[index].style.background = null;
          }, 200);

          clickedCounter--;
        } else {
          cells.children[index].style.background = '#f2bcbc url("images/flag.svg")';
          cells.children[index].style.backgroundSize = '55px';
          cells.children[index].style.backgroundPosition = '55% 25%';

          clickedCounter++;
        }

        flagCounter.firstChild.textContent = clickedCounter;

        if (clickedCounter >= bombs.length) {
          flagCounter.style.color = '#e88706';
          flagCounter.style.borderColor = '#e88706';
        } else {
          flagCounter.style.color = null;
          flagCounter.style.borderColor = null;
        }

        CheckWin();
      }
    });

    [...levels].forEach((_, index) => {
      levels[index].onclick = () => {
        difficulty = levels[index].id.split('-')[1];
        localStorage.setItem('minesweeper_difficulty', difficulty);

        Main();
      }
    });
  })();

  buttonRestart.onclick = Main;
}

window.onload = Main;
