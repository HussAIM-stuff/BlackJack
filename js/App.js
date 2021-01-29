/**
 * @description Collection that contains:
 *  -.name = string
 *    => player's name
 *  -.score = number
 *    => player's score
 *  -.As = number
 *    => quantity of 'A' cards
 *  -.drawn = Array
 *    => contains the player's cards
 *  -.playingArea = string
 *    => jQuery css tag for on screen cards
 *  -.scoreArea = string
 *    => jQuery css tag for on screen score
 *
 */
const johnD = {
  'name': 'johnD',
  'score': 0,
  'As': 0,
  'drawn': [],
  'playingArea': '#areaP',
  'scoreArea': '#scoreP',
};

/**
 * @description Collection that contains:
 *  -.name = string
 *    => dealer
 *  -.score = number
 *    => dealer's score
 *  -.As = number
 *    => quantity of 'A' cards
 *  -.drawn = Array
 *    => contains the dealer's cards
 *  -.playingArea = string
 *    => jQuery css tag for on screen cards
 *  -.scoreArea = string
 *    => jQuery css tag for on screen score
 */
const dealer = {
  'name': 'dealer',
  'score': 0,
  'As': 0,
  'drawn': [],
  'playingArea': '#areaD',
  'scoreArea': '#scoreD'
};

/////////////// GLOBALS ///////////////

const nCards = 13;

const nSuits = 4;

const nCardsTotal = nSuits * nCards;

/**
 * 
 * @constant {Array} contains the cards left on the deck.
 */
const deck = [];

/////////////// FUNCTIONS ///////////////


/**
 * @param {number} num a number to convert into a card.
 * @returns {object} a card object. {
 *   suit: {string},
 *   num: {string},
 *   value: {number},
 *   file: {string}
 * }
 * @changes no
 * @description Function used when creating the deck.
 * Takes a random number and returns a card object. */
let number2card = (num) => {
  const suits = {
    0: 'Hearts',
    1: 'Tiles',
    2: 'Clovers',
    3: 'Pikes'
  };

  let xSuit = suits[Math.floor(num / 13)];
  let xNum = 0;
  let xValue = (num % 13)+1;
  let xFile = xSuit[0];

  if(xValue < 10)
    xFile += '0';
  xFile += xValue.toString() + '.svg';

  switch ((num %13) + 1) {
    case 1:
      xNum = 'A';
      xValue = 11;
      break;
    case 11:
      xNum = 'J';
      xValue = 10;
      break;
    case 12:
      xNum = 'Q';
      xValue = 10;
      break;
    case 13:
      xNum = 'K';
      xValue = 10;
      break;
    default:
      xNum = ((num %13) + 1).toString();
      xValue = ((num %13) + 1);
      break;
  };

  card = {
    suit: xSuit,
    num: xNum,
    value: xValue,
    file: xFile,
  };
  return card;
};

/**
 * @returns {void} nothing
 * @changes deck[ ]
 * @description Function used to create the full deck of cards before starting the game,
 * also used to reset the deck after restarting,
 * it checks if the deck isn't complete of if its fully empty before modifying it.
 */
let initializeDeck = () => {
  if(deck.length < 52) {
    if(deck.length > 0) {
      deck.splice(0);
      console.log('Clearing deck for initialization - initializeDeck()');
    }
    for(let i = 0; i < nCardsTotal; i++) {
      deck.push(number2card(i));
    }
    console.log(`Initialized deck - ${deck.length} cards added - initializeDeck()`);
  }
  else {
    console.log(`Deck not initialized, it already ${deck.length} cards - initializeDeck()`);
  }
  if(deck.length !== 52)
      throw new Error('Deck initialization failed - initializeDeck()');
};

/**
 * @param {object} player
 * @returns {void} nothing
 * @description assigns to position a random number (0 to deck.length)
 * adds the value of it to the player's score, adds a card object to 
 * the player's deck and shows the card and the score in the screen
 */
let randomCard = (player) => {
  position = Math.floor(Math.random() * deck.length)
  console.log(`Random card selected for player "${player.name}": "${deck[position].num} ${deck[position].suit}" - randomcard(${player.name})`);
  card = deck[position];
  player.score += card.value;
  console.log(`New score for ${player.name}: ${player.score}`);
  if(card.num == 'A') {
    player.As++;
  }
  $(player.playingArea).append(`<img class="card" src="./img/cards/${card.file}" />`);
  player.drawn.push(deck.splice(position,1)); //removes from deck and adds to drawn
  $(player.scoreArea).html(`<div>${player.score}</div>`).show();
  console.log(`"${card.num} ${card.suit}" added to ${player.playingArea} - addcard(${player.name},${card.num} ${card.suit},${position})`)
};

/**
 * @returns {void} nothing
 * @calls playerPlay()
 * @changes $('#restart').hide()
 * @description restarts the game,
 * reseting the screen and the players 
 * calling player(play) after everything is cleared
 */
let restart = () => {
  console.log('Restarting game - restart()');
  console.log('Resetting players - resetPlayers()')
  johnD.score = 0;
  johnD.As = 0;
  johnD.drawn.splice(0);
  dealer.score = 0;
  dealer.As = 0;
  dealer.drawn.splice(0);
  $('#areaD').html('');
  $('#areaP').html('');
  $('#scoreD').html('');
  $('#scoreP').html('');
  $('#deck').html('');
  $('#results').html('');
  console.log('Table html elements cleared - clearTable()');
  playerPlay(0);
};

/**
 * 
 * @returns {void} nothing
 * @calls randomCard(player)
 * @calls finishGame()
 * @description Autoplays the dealer and in the end finishes the game
 * if the score is not less than 17, otherwise calls it self with
 */
let dealerPlay = (opt) => {
  if(opt === 'BJ'){
    console.log(`\n${dealer.name} has BlackJack!!! ${dealer.name}'s turn now)`);
    randomCard(dealer);
    if(dealer.score === 21 && dealer.drawn.length === 2) {
      $('#results').html('DOUBLE BLACKJACK<br><span>PUSH GAME</span>');
      $('#results').show();
      console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\nPUSH GAME - showResults()`);
    }
    else {
      $('#results').html(`PLAYER BLACKJACK<br><span>PLAYER WINS</span>`);
      $('#results').show();
      console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\n${johnD.name.toUpperCase()} BLACKJACK, PLAYER WINS - showResults()`);
    }
    $('#restart').show();
    $('#deck').hide();
    $('.name').hide();
  }
  else {
    console.log(`\n${dealer.name} is playing)`);
    if(dealer.score < 17) {
      randomCard(dealer);
      setTimeout('dealerPlay()',1000);
    }
    else
    {
      finishGame();
    }
  }
};

/**
 * @returns {void} nothing
 * @description evaluates the scores and shows in the screen the result.
 * Shows the restart button afterwards.
 * The situation of the player having BlackJack or being busted...
 * is handled outside of this function
 */
let finishGame = () => {
  console.log('Finishing game - finishGame()');
  if(dealer.score === 21 && dealer.drawn.length === 2) {
      $('#results').html('DEALER WINS: BLACKJACK');
      $('#results').show();
      console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\nDEALER WINS: BLACKJACK - showResults()`);
  }
  else if(dealer.score > 21) {
    $('#results').html(`PLAYER WINS<br><span>DEALER BUSTS</span>`);
    $('#results').show();
    console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\n${johnD.name.toUpperCase()} WINS - showResults()`);
  }
  else if(dealer.score === johnD.score) {
    $('#results').html('PUSH GAME.');
    $('#results').show();
    console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\nPUSH GAME - showResults()`);
  }
  else if(dealer.score > johnD.score) {
      $('#results').html('DEALER WINS.');
      $('#results').show();
      console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\nDEALER WINS - showResults()`);
  }
  else if(dealer.score < johnD.score) {
    $('#results').html(`PLAYER WINS`);
    $('#results').show();
    console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\n${johnD.name.toUpperCase()} WINS - showResults()`);
  }
  $('#restart').show();
  $('#deck').hide();
  $('.name').hide();
  
};

/**
 * @returns {void} nothing
 * @calls initializeDeck()
 * @calls randomCard(johnD && dealer)
 * @calls dealerPlay(dealer)
 * @description Starts the game, drawing a 2 cards for the player 
 * and one for the dealer, if the player gets 21, then it passes
 * the game to the dealer, otherwise... the game is paused until
 * button interaction.
 */
let playerPlay = (num) => {
  switch(num) {
    case 0:
      console.log('\nPlayer is playing - playerPlay()');
      initializeDeck(); //Initialize Deck stack
      $('#deck').show();
      $('.name').show();
      randomCard(johnD); //Draw Initial Cards, 2 for the player and 1 for the dealer
      setTimeout('playerPlay(1)',1000);
      break;
    case 1:
      randomCard(johnD); //Draw Initial Cards, 2 for the player and 1 for the dealer
      setTimeout('playerPlay(2)',1000);
      break;
    case 2:
      randomCard(dealer);
      if(johnD.score < 21) {
        $('#hit, #stand').show();
        console.log('Waiting player move... - playerPlay()');
      }
      else if(johnD.score === 21){
        setTimeout('dealerPlay("BJ")',1000);
      }
      else {
        setTimeout('dealerPlay()',1000);
      }
      break;
  }
}

/////////////// Events.js ///////////////
$('#start').on('click', () => {
  $('#start').hide();// hide start button
  console.log('\nCLICK detected on button: #start');
  playerPlay(0,true);
});

$('#stand').on('click', () => {
  $('#hit, #stand').hide();
  console.log('\nCLICK detected on button: #stand');
  setTimeout('dealerPlay()',1000);
});

$('#restart').on('click', () => {
  $('#restart').hide();// hide start button
  $('#results').hide();

  console.log('\nCLICK detected on button: #restart');
  restart(0);
});

$('#hit').on('click', () => {
  $('#hit, #stand').hide();
  console.log('\nCLICK detected on button: #hit');
  randomCard(johnD);
  if(johnD.score < 21) {
    $('#hit, #stand').show();
    console.log('Waiting player move... - playerPlay()');
  }
  else if(johnD.score > 21) {
    $('#results').html('DEALER WINS<br><span>PLAYER BUSTS</span>');
    $('#results').show();
    $('#restart').show();
    $('#deck').hide();
    $('.name').hide();

    console.log(`DEALER: ${dealer.score}\nPLAYER: ${johnD.score}\nDEALER WINS - showResults()`);
  }
  else {
    setTimeout('dealerPlay()',1000);
  }
});

console.log("Click start to play!")

