//WAR CARDS BROWSER GAME

// DOM elements
let endGame = false
let deckId
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const myScoreEl = document.getElementById("my-score")

//Array with all possible card options in string format
const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]


//new deck btn
newDeckBtn.addEventListener("click", handleClick)
    
// Fn that runs 'when new deck' is pressed; API call-returns a new deck, accesable via 'deck id'.
// 1. grabs the deck id needed for the draw function. 
//2. Sets the 'remaining cards' heading. 
// 3. Renews the disabled 'draw btn' from a previouse game.

function handleClick() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            //deck id
            deckId = data.deck_id
            //set remaining cards display
            remainingText.textContent = `Remaining cards: ${data.remaining}`  

     //*******************************************************************
            //if game finished: need to reset these fields;
            //1. draw btn
            data.remaining > 0 ? drawCardBtn.disabled = false : undefined
            //2. player scores
            computerScore = 0
            myScore = 0
            //3. score displays
            computerScoreEl.textContent = `Computer score: ${computerScore}`
            myScoreEl.textContent = `My score: ${myScore}`
            //4. heading
            header.textContent = "War Cards" 
            //5. card display
            cardsContainer.children[0].innerHTML = ''
            cardsContainer.children[1].innerHTML = '' 
    //******************************************************************* 
        })
}

//Draw btn using call back fn
//1. Uses the deck id obtained in first API call to draw 2 cards from the deck which returns 2 cards
//2. updates the remaining cards heading
//3. displays the cards respectively (player vs computer)
//4. impliments the logic accessed from the central logic function below (determineCardWinner) to display scores and game status text

drawCardBtn.addEventListener("click", () => {
    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            //heading
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            //Display the cards selected on 'draw'
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            //variable used to set the winner heading via a function call from fn(determineCardWinner) below
            const winnerText = determineCardWinner(data.cards[0], data.cards[1], valueOptions)
            header.textContent = winnerText

            //set 'draw btn' to disabled when game ends
            if(data.remaining === 0 ){
                drawCardBtn.disabled = true
                //Score heading updates corresponding to the score-variables which are changed via the fn(determineCardWinner) below
                if (computerScore > myScore) {
                    header.textContent = "The computer won the game!"
                } else if (myScore > computerScore) {
                    header.textContent = "You won the game!"
                } else {
                    header.textContent = "It's a tie game!"
                }
            }
        })
        // gameOn = true    
})
//Central Logic function of the game

function determineCardWinner(card1, card2, array) {

    /* 
    Initiation of a variable for each card. Using indexOf method to loop through the array and set 
    the value of the variable according to the index of where it appears in the array.
    > The value used to loop through the array is obtained via the fn param here of card1, card2.value,
    i.e the response object as is passed in on the fn call(data.cards[0] etc) and .value 
    returns the value of that cards from the API as a string. 
    > Then the value of the variable is set according to the index position of that value in the array. 
    This ensures that the real card values will always be copaired as greate or lesser, 
    even though they are all strings. 
    */

    const card1ValueIndex = array.indexOf(card1.value)
    const card2ValueIndex = array.indexOf(card2.value)
    
    //Each if statement sets the score variable via comparison of the above variables 
    //and returns the apropriate text which we use above to set the score and winner titles
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer score: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        myScore++
        myScoreEl.textContent = `My score: ${myScore}`
        return "You win!"
    } else {
        return "War!"
    }
}

