let addScript = (file) => {
  var script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  document.getElementsByTagName('body')[0].appendChild(script);
}

let addStyle = (file) => {
  $('head').append('<link rel="stylesheet" href="'+file+'" type="text/css" />');
}

let testHTML = () => {
  $('.score').html('00');
  $('#nameD').html('Dealer');
  $('#nameP').html('Player');
  $('#results').html('House wins');
  $('').html('');
  $('').html('');
}

let createHTML = () => {
  $('#canvas').html('');
  $('<h1>').attr('id','title').text('BlackJack').appendTo('#canvas');
  $('<div>').attr('id','scoreD').addClass('score').appendTo('#canvas').hide();
  $('<div>').attr('id','areaD').addClass('playingArea').appendTo('#canvas');
  $('<div>').attr('id','nameD').addClass('name').text('Dealer').appendTo('#canvas').hide();
  $('<div>').attr('id','areaDeck').appendTo('#canvas');
  $('<img>').attr('id','deck').addClass('card').attr('src','./img/cards/Back_blue.svg').appendTo('#areaDeck').hide();
  $('<div>').attr('id','results').appendTo('#areaDeck').hide();
  $('<div>').attr('id','scoreP').addClass('score').appendTo('#canvas').hide();
  $('<div>').attr('id','areaP').addClass('playingArea').appendTo('#canvas');
  $('<div>').attr('id','nameP').addClass('name').text('Player').appendTo('#canvas').hide();
  $('<div>').attr('id','buttons').appendTo('#canvas');
  $('<img>').attr('id','start').addClass('buttonSquare').attr('src','./img/buttons/bStart.png').css('cursor','pointer').appendTo('#buttons');
  $('<img>').attr('id','restart').addClass('buttonCircle').attr('src','./img/buttons/bRestart.png').css('cursor','pointer').appendTo('#buttons').hide();
  $('<img>').attr('id','hit').addClass('buttonSquare').attr('src','./img/buttons/bHit.png').css('cursor','pointer').appendTo('#buttons').hide();
  $('<img>').attr('id','stand').addClass('buttonSquare').attr('src','./img/buttons/bStand.png').css('cursor','pointer').appendTo('#buttons').hide();
  addScript('js/App.js');
  document.title = 'BlackJack!!';
}

addStyle('style.css');
createHTML();
