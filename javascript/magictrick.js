

// Card Data
//
var suits = ['C','H','S','D'];
var ranks = [2,3,4,5,6,7,8,9,10,'J','Q','K','Ace'];
var print = function(a) { console.log(a); }



function createDeck() {
  var deck = [];
  var ptr = 0;
  for( var s = 0; s < suits.length; s++) {
    for(var r = 0 ; r < ranks.length; r++) {
      deck[ptr] =  ranks[r] + suits[s];
      ptr++;
    }
  }

  return deck;
}


//Fisher Yates implementation from Mike Bostocks
//http://bost.ocks.org/mike/shuffle/

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


function shuffleDeck() {
  shuffledDeck = shuffleDeck(deck);
}


function getCard(colNum, pos) {
  col = document.getElementsByClassName("column")[colNum];
  var card;
  if(col) {
    card = col.getElementsByClassName("card")[pos];
  }

  return card;
}


function setCard(colNum, pos, r, s) {
  //get the column
  col = document.getElementsByClassName("column")[colNum];
  if(col) {
    card = getCard(colNum, pos); //col.getElementsByClassName("card")[pos];
    if(card) {
      rank = card.getElementsByClassName("rank")[0];
      suit = card.getElementsByClassName("suit")[0];
      if( rank && suit) {
        //print("rank = " + rank.innerHTML + " suit = " + suit.innerHTML);

        rank.innerHTML = '';
        suit.innerHTML = '';

        newRank = document.createTextNode(r);
        newSuit = document.createTextNode(s);

        rank.appendChild(newRank);
        suit.appendChild(newSuit);
      }
    }
  }
}


// ----------------------------
// Game Logic

var cardChosen = false;
var favoriteNumberSelected = false;
var HUD = document.getElementById("HUD");
var okBtn = document.getElementById("okBtn");

/*
var btnOK = document.createElement("Button");
btnOK.className = "okButton";
btnOK.appendChild(document.createTextNode("OK"));
*/




function onCardChosen() {
  //after card is chosen chose favorite number
  cardChosen = true;
  console.log("card chosen now running select favorite number");
  STATErunSelectFavoriteNumber();

}


function STATErunCardSelection() {
  var string = "Choose a card and remember it... ";
  var txt = document.createTextNode(string);

  console.log("STATE run card selection");

  if(okBtn) {
    okBtn.onclick = onCardChosen;
  }

  if(!cardChosen) {
    setInstructions(string);
  }
}


function STATErunSelectFavoriteNumber(){
  console.log("State run select favorite number");
  var string = "Pick a number between 1...27";


  if(okBtn) {
    okBtn.onclick = onFavoriteNumberSelected;
  }

  if(!favoriteNumberSelected) {
    // input number

    var inputNumber = document.createElement("INPUT");
    inputNumber.id = "numberChoice";
    inputNumber.type = "number";
    inputNumber.min = 1;
    inputNumber.max = 27;

    console.log("got here 2");
    setInstructions(string);
    HUD.insertBefore(inputNumber, HUD.getElementsByClassName("instruction")[0].nextSibling);

  }
}


function setInstructions(msg) {
  var txt = document.createTextNode(msg);
  HUD.getElementsByClassName("instruction")[0].innerHTML = '';
  HUD.getElementsByClassName("instruction")[0].appendChild(txt);
}


function onFavoriteNumberSelected() {
  print("on favorite number selected handler");
  var favoriteNumberSelected = false;

  //get rid of OK button
  //replace instructions with the choosen number
  setInstructions("Your chosen number is: " + document.getElementById("numberChoice").value);
  document.getElementById("numberChoice").style.visibility = "hidden";
  okBtn.style.visibility = "hidden";

}

function reset() {
  cardChosen = false;
  favoriteNumberSelected = false;
}


// ----------------------------

reset();
STATErunCardSelection();


/*
STATErunCardSelection();
print(okBtn.onclick);

newDeck = createDeck();
print(newDeck.length);
for( var i=0; i < deck.length; ++i) {
  print(newDeck[i]);
}

var newShuffledDeck = shuffle(newDeck);

for(var i=0; i < 10; i++) {
  print(newShuffledDeck[i]);
}


setCard(0,1, "Me", "you");

print(document.getElementsByClassName("column")[0].getElementsByClassName("card")[0].getElementsByClassName("suit")[0].className);
*/
