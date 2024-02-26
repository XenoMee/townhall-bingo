import words from "/words.js";
let words2 = words;
let words3 = [...words2];
let markedTiles = ["tile-12"];
const body = document.querySelector("body");
const bingoContainer = document.getElementById("bingo-container");
const playBingoBtn = document.getElementById("play-bingo");
const section = document.querySelector("section");
const textArea = document.getElementById("own-words");
const preview = document.getElementById("preview-of-words");
let inputtedWords = "";
let arrayOfWords = "";
let createCardBtn = document.getElementById("create-card");

document.addEventListener("click", function (e) {
  if (e.target.closest("#play-bingo")) {
    renderBingoCard(words2);
    playBingoBtn.classList.add("hidden");
  } else if (e.target.closest("#create-card")) {
    bingoContainer.classList.toggle("blur");
    section.classList.toggle("shown");
    textArea.innerHTML = `${words3}`;
    inputtedWords = textArea.value;
    arrayOfWords = splitIntoWords(inputtedWords);
    updatePreview(arrayOfWords, preview);
    textArea.scrollIntoView({ behavior: "smooth" });
    if (textArea) {
      textArea.addEventListener("keyup", function (e) {
        let inputtedWords = textArea.value;
        let arrayOfWords = splitIntoWords(inputtedWords);
        updatePreview(arrayOfWords, preview);
      });
    }
    createCardBtn.disabled = true;
  } else if (e.target.closest("#submit")) {
    section.classList.toggle("shown");
    bingoContainer.classList.toggle("blur");
    let customWords = textArea.value
      .split(",")
      .map((word) => word.trim())
      .filter(
        (word, index, self) => self.indexOf(word) === index && word != ""
      );

    shuffle(words);
    console.log(customWords);
    customWords.forEach((customWord, index) =>
      words.splice(index, 1, customWord)
    );
    markedTiles = ["tile-12"];
    renderBingoCard(customWords);

    customWords.forEach((customWord, index) =>
      words.splice(index, 1, customWord)
    );
    markedTiles = ["tile-12"];
    renderBingoCard(customWords);
  } else if (e.target.closest(".remove-word")) {
    const removeButton = e.target.closest(".remove-word");
    const index = parseInt(removeButton.getAttribute("data-index"), 10);
    if (!isNaN(index)) {
      const preview = document.getElementById("preview-of-words");
      removeWord(words3, index, preview);
    }
  } else if (e.target.closest("#close-bingo")) {
    const bingo = document.getElementById("bingo");
    bingo.style.display = "none";
    const buttonContainer = document.getElementById("button-container");
    buttonContainer.innerHTML = `<button id = "restart-bingo">Restart game</button>`;
  } else if (e.target.closest("#remove-all")) {
    const removeAllBtn = document.getElementById("remove-all");
    removeAll(words3);
  } else if (e.target.closest("#restart-bingo")) {
    renderBingoCard(words2);
    markedTiles = ["tile-12"];
  } else if (e.target.closest("#close-add-words")) {
    section.classList.toggle("shown");
    bingoContainer.classList.toggle("blur");
    createCardBtn.disabled = false;
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
  bingoContainer.innerHTML = `
   <div id = "bingo-card" > ${renderedBingoCard} </div>
   <div id = "button-container"><button id = "create-card">Create your own bingo card</button></div>
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

function updatePreview(array, previewElement) {
  previewElement.innerHTML = "";
  array.forEach((word, index) => {
    previewElement.innerHTML += `<span id="initial-word">${word} <button class="remove-word" data-index="${index}">X</button></span>`;
  });
}

function splitIntoWords(inputString) {
  return inputString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .filter((word, index, self) => self.indexOf(word) === index);
}

function removeWord(array, index, previewElement) {
  if (index > -1 && index < array.length) {
    const wordToRemove = array[index];
    array.splice(index, 1);
    updatePreview(array, previewElement);
    console.log(`from removing, the new words are: ${words3}`);
    const textArea = document.getElementById("own-words");
    const wordsInTextArea = textArea.value
      .split(",")
      .map((word) => word.trim());
    const updatedWordsInTextArea = wordsInTextArea.filter(
      (word) => word !== wordToRemove
    );
    textArea.value = updatedWordsInTextArea.join(", ");
  }
}

function removeAll(array) {
  const textArea = document.getElementById("own-words");
  const preview = document.getElementById("preview-of-words");
  array.splice(0, array.length);
  preview.innerHTML = "";
  textArea.value = "";
}
