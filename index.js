import words from "/words.js";
const body = document.querySelector("body");
let markedTiles = ["tile-12"];
document.addEventListener("click", function (e) {
  if (e.target.closest("#play-bingo")) {
    renderBingoCard(words);
  } else if (e.target.closest("#create-card")) {
    body.innerHTML = `<header></header>
    <form>
      <textarea id ="own-words" placeholder="Add your words, separate them by comma"></textarea>
      <div id = "preview-of-words"></div>
      <button id = "submit">Submit</button>
    
    `;
    const preview = document.getElementById("preview-of-words");
    const textArea = document.querySelector("textarea");

    if (textArea) {
      textArea.addEventListener("keyup", function (e) {
        if (textArea.value) {
          let customWords = textArea.value
            .split(",")
            .map((word) => word.trim())
            .filter(
              (word, index, self) => word !== "" && self.indexOf(word) === index
            );
          let previewWords = "";
          customWords.forEach(function (word) {
            previewWords += `<span>${word} </span>`;
          });
          preview.innerHTML = previewWords;
        }
      });
    }
  } else if (e.target.closest("#submit")) {
    e.preventDefault();
    const textArea = document.querySelector("textarea");
    let customWords = textArea.value
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word !== "");
    shuffle(words);
    console.log(customWords);
    customWords.forEach((customWord, index) =>
      words.splice(index, 1, customWord)
    );
    markedTiles = ["tile-12"];
    renderBingoCard(words);
  } else if (e.target.closest("#close-bingo")) {
    const bingo = document.getElementById("bingo");
    bingo.style.display = "none";
    const buttonContainer = document.getElementById("button-container");
    buttonContainer.innerHTML = `<button id = "restart-bingo">Restart game</button>`;
  } else if (e.target.closest("#restart-bingo")) {
    renderBingoCard(words);
    markedTiles = ["tile-12"];
  } else if (e.target.closest(".tile")) {
    markedTiles.push(e.target.id);
    document.getElementById(e.target.id).classList.toggle("marked");

    if (markedTiles.length >= 5) {
      const winConditions = [
        //horizontal
        ["tile-0", "tile-1", "tile-2", "tile-3", "tile-4"],
        ["tile-5", "tile-6", "tile-7", "tile-8", "tile-9"],
        ["tile-10", "tile-11", "tile-12", "tile-13", "tile-14"],
        ["tile-15", "tile-16", "tile-17", "tile-18", "tile-19"],
        ["tile-20", "tile-21", "tile-22", "tile-23", "tile-24"],
        //vertical
        ["tile-0", "tile-5", "tile-10", "tile-15", "tile-20"],
        ["tile-1", "tile-6", "tile-11", "tile-16", "tile-21"],
        ["tile-2", "tile-7", "tile-12", "tile-17", "tile-22"],
        ["tile-3", "tile-8", "tile-13", "tile-18", "tile-23"],
        ["tile-4", "tile-9", "tile-14", "tile-19", "tile-24"],
        //diagonal
        ["tile-0", "tile-6", "tile-12", "tile-18", "tile-24"],
        ["tile-4", "tile-8", "tile-12", "tile-16", "tile-20"],
      ];
      checkBingo(winConditions, markedTiles);
    }
  }
});

function buildTile(word, index) {
  return `<div class = "tile" id = "tile-${index}">
            ${word}
        </div>`;
}

function renderBingoCard(array) {
  const bingoCard = createBingoCard(array);
  const renderedBingoCard = bingoCard
    .map((tile, index) => buildTile(tile, index))
    .join("");
  body.innerHTML = `<header></header>
   <div id = "bingo-card" > ${renderedBingoCard} </div>
   <div id = "button-container"><button id = "create-card">Add your own words</button></div>
   <div id = "bingo">
    <div id="close-bingo">X</div>
    <img src = "./images/leo.gif">
    </div>`;
}

function createBingoCard(array) {
  shuffle(array);
  const bingoCard = array.slice(0, 25);
  bingoCard[12] = "Free";
  return bingoCard;
}

function shuffle(array) {
  // A  way to shuffle an array
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
}

function checkBingo(winConditions, markedTiles) {
  let bingoAchieved = false;

  winConditions.forEach((condition) => {
    if (condition.every((tile) => markedTiles.includes(tile))) {
      bingoAchieved = true;
    }
  });

  if (bingoAchieved) {
    const bingo = document.getElementById("bingo");
    bingo.style.display = "flex";
    console.log("bingo!");
  }
}
