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
  'startTop': 3.5,
  'startLeft': 1,
  'nCards': 0
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
  'scoreArea': '#scoreD',
  'startTop': 3.5,
  'startLeft': 1,
  'nCards': 0
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
  if(deck.length !== 52) {
    if(deck.length !== 0) {
      deck.splice(0);
    }
    for(let i = 0; i < nCardsTotal; i++) {
      deck.push(number2card(i));
    }
  }
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
  card = deck[position];
  player.score += card.value;

  if(card.num == 'A') {
    player.As++;
  }

  while(player.score > 21 && player.As > 0) {
    player.score -= 10;
    player.As--;
  }

  $('<img>').addClass('card').attr('src',`./img/cards/${card.file}`).css('position','absolute').css('top',`${player.startTop.toString()}px`).css('left',`${(player.startLeft + (player.nCards * 20)).toString()}px`).appendTo(player.playingArea);
  player.nCards++;
  player.drawn.push(deck.splice(position,1)); //removes from deck and adds to drawn

  if(player.name === 'dealer'){
    $(dealer.scoreArea).html(`<div>Dealer: <strong style='color:white'>${("0"+dealer.score).slice(-2)}</strong></div>`).show();
  }
  else {
    $(johnD.scoreArea).html(`<div>Player: <strong style='color:white'>${("0"+johnD.score).slice(-2)}</strong></div>`).show();
  }
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
  johnD.score = 0;
  johnD.As = 0;
  johnD.drawn.splice(0);
  johnD.nCards = 0;
  dealer.score = 0;
  dealer.As = 0;
  dealer.drawn.splice(0);
  dealer.nCards = 0;
  $('#areaD').html('');
  $('#areaP').html('');
  $('#scoreD').html('');
  $('#scoreP').html('');
  $('#deck').html('');
  $('#results').html('');
  $('#deck').show();
  setTimeout('playerPlay(0)',1000);
};

/**
 * 
 * @returns {void} nothing
 * @calls randomCard(player)
 * @calls finishGame()
 * @description Autoplays the dealer and in the end finishes the game
 * if the score is not less than 17, otherwise calls it self with
 */
let dealerPlay = (num) => {
  switch(num) {
    case 0:
      randomCard(dealer);

      if(johnD.score < 21) {
        $('#hit, #stand').show();
      }
      else {
        setTimeout('dealerPlay(1)',1000);
      }
      break;
    case 1:
      if(johnD.score === 21 && johnD.drawn.length === 2){
        randomCard(dealer);

        if(dealer.score === 21 && dealer.drawn.length === 2) {
          $('#results').html('DOUBLE BLACKJACK<br><span>PUSH GAME</span>');
          $('#results').show();
        }
        else {
          $('#results').html(`PLAYER BLACKJACK<br><span>PLAYER WINS</span>`);
          $('#results').show();
        }
        $('#restart').show();
        $('#deck').hide();
        $('.name').hide();
      }
      else if(dealer.score < 17) {
          randomCard(dealer);
          setTimeout('dealerPlay(1)',1000);
      }
      else {
      finishGame();
      }
      break;
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
  if(dealer.score === 21 && dealer.drawn.length === 2) {
      $('#results').html('DEALER WINS: BLACKJACK  :(');
      $('#results').show();
  }
  else if(dealer.score > 21) {
    $('#results').html('PLAYER WINS<br><span>DEALER BUSTS</span>');
    $('#results').show();
  }
  else if(dealer.score === johnD.score) {
    $('#results').html('PUSH GAME!!!');
    $('#results').show();
  }
  else if(dealer.score > johnD.score) {
      $('#results').html('DEALER WINS  :(');
      $('#results').show();
  }
  else if(dealer.score < johnD.score) {
    $('#results').html('PLAYER WINS');
    $('#results').show();
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
      initializeDeck(); //Initialize Deck stack
      randomCard(johnD); //Draw Initial Cards, 2 for the player and 1 for the dealer
      setTimeout('playerPlay(1)',1000);
      break;
    case 1:
      randomCard(johnD); //Draw Initial Cards, 2 for the player and 1 for the dealer
      setTimeout('dealerPlay(0)',1000);
      break;
    case 2:
      randomCard(johnD);

      if(johnD.score < 21) {
        $('#hit, #stand').show();
      }
      else if(johnD.score > 21) {
        $('#results').html('DEALER WINS<br><span>PLAYER BUSTS</span>');
        $('#results').show();
        $('#restart').show();
        $('#deck').hide();
        $('.name').hide();
      }
      else {
        setTimeout('dealerPlay(1)',1000);
      }
      break;
  }
};

/////////////// Events.js ///////////////
$('#start').on('click', () => {
  $('#start').hide();// hide start button
  $('#deck').show();
  setTimeout('playerPlay(0)',1000);
});

$('#stand').on('click', () => {
  $('#hit, #stand').hide();
  setTimeout('dealerPlay(1)',1000);
});

$('#restart').on('click', () => {
  $('#restart').hide();// hide start button
  $('#results').hide();

  restart(0);
});

$('#hit').on('click', () => {
  $('#hit, #stand').hide();
  playerPlay(2);
});