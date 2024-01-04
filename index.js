import words from '/words.js'
const body= document.querySelector("body")
const markedTiles = []
document.addEventListener("click", function(e) {
    
   if (e.target.closest("#play-bingo")) {
        renderBingoCard(words)
       
   } else if (e.target.closest("#create-card")) {
       console.log("create-card")
       
   } else if (e.target.closest("#submit")) {
       console.log("submit")
       
   } else if (e.target.closest(".tile")) {
       markedTiles.push(e.target.id)
        console.log(markedTiles)
       document.getElementById(e.target.id).classList.add("marked")
       
       if (markedTiles.length >= 5) {
          const bingo = markedTiles.includes("tile-0","tile-1","tile-2","tile-3","tile-4")? "yes":"no"
          console.log(bingo)
          
       }
       
   }   
})

function buildTile(word, index) {
    return (
        `<div class = "tile" id = "tile-${index}">
            ${word}
        </div>`
    )
}

function renderBingoCard(array) {
   const bingoCard = createBingoCard(array)
   const renderedBingoCard = bingoCard.map((tile, index) => buildTile(tile, index)).join("")
   body.innerHTML= `<header></header>
   <ul>
   <li>B</li>
   <li>I</li>
   <li>N</li>
   <li>G</li>
   <li>O</li>
   </ul>
   <div id = "bingo-card" > ${renderedBingoCard} </div>
   <button id = "create-card">Create your own card</button>`
}



function createBingoCard(array) {
    shuffle(array)
    const bingoCard = array.slice(0,25)
    bingoCard[12] = "Free"
    return bingoCard
}


function shuffle(array) { // A  way to shuffle an array
    for (let i = array.length - 1; i > 0; i--) {
       let randomIndex = Math.floor(Math.random() *  (i+1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}


// check if Bingo 