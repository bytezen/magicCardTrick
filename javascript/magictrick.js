
// Card Data
//
var suits = ['C','H','S','D'];
var ranks = [2,3,4,5,6,7,8,9,10,'J','Q','K','Ace'];
var print = function(a) { console.log(a); }
var TOP = 0, MIDDLE = 1, BOTTOM = 2;


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
var favoriteNumber;

// 3 member array that specifies which order the
// users card shoul be placed

var columnStackOrder = [];


//track the times user selected columns, 3 max
var columnChooseCount = 0;

/*
var btnOK = document.createElement("Button");
btnOK.className = "okButton";
btnOK.appendChild(document.createTextNode("OK"));
*/




// ----------------------------
// STATES

function STATErunCardSelection() {
  console.log("STATE run card selection");
  var string = "Choose a card and remember it... ";
  var txt = document.createTextNode(string);

  okBtn.style.visibility = "visible";

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

    setInstructions(string);
    HUD.insertBefore(inputNumber, HUD.getElementsByClassName("instruction")[0].nextSibling);

  }
}



function initSTATEchooseColumn() {
  //set click handlers for the buttons
  var btns = document.getElementsByClassName("columnSelectBtn");

  for(var i=0; i < btns.length; ++i) {
    btns[i].onclick = createFunction(i);
  }

  STATEchooseColumn();
}


function STATEchooseColumn() {

  //turn on the buttons
  var btns = document.getElementsByClassName("columnSelectBtn");

  for(var i=0; i < btns.length; ++i) {
    btns[i].style.visibility = "visible";
  }
}


// ----------------------------


function setInstructions(msg) {
  HUD.getElementsByClassName("instruction")[0].innerHTML = '';
  appendInstructions(msg);
}

function appendInstructions(msg) {
  var txt = document.createTextNode(msg);
  HUD.getElementsByClassName("instruction")[0].appendChild(txt);
}

// -----------------------
// handlers
// -----------------------

function onSelectedColumn(i) {
  console.log("you selected column:: " + i);


  if(columnChooseCount < 2) {
    console.log("column " + i + " should be stacked on the: " + columnStackOrder[columnChooseCount]);

    //redeal the cards based on the column
    trickDeck = stackDeck(trickDeck,i,columnStackOrder[columnChooseCount]);
    dealCards(trickDeck);
    //hide the buttons
    //show the buttons
    //add to the instructions
    appendInstructions(" Now which column is your card in? ");
    columnChooseCount++;
  } else {
    trickDeck = stackDeck(trickDeck,i,columnStackOrder[columnChooseCount]);
    dealCards(trickDeck);
   console.log("WE SHOULD NOW CHOOSE THE CARD -- transition state");
    console.log("Your card is: " + trickDeck[favoriteNumber-1] );

    foundCard = getCardHTML(favoriteNumber-1);
    foundCard.style.background = "#FF0";

  }
}

function onFavoriteNumberSelected() {

  var favoriteNumberSelected = false;

  //get rid of OK button
  //replace instructions with the choosen number
  favoriteNumber = document.getElementById("numberChoice").value;
  setInstructions("Your chosen number is: " + favoriteNumber);
  document.getElementById("numberChoice").style.visibility = "hidden";
  okBtn.style.visibility = "hidden";

  setColumnStackOrder();
  initSTATEchooseColumn();

}


function onCardChosen() {
  //after card is chosen chose favorite number
  cardChosen = true;
  console.log("card chosen now running select favorite number");
  STATErunSelectFavoriteNumber();

}


// use this to create an external variable
//reference for the loop variable.
// see here for explanation:
// http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
function createFunction(i) {
  return function() { onSelectedColumn(i); }
}



// ---------------

function stackDeck(deck,selColumn, stackPos) {
  var stack1 = [], stack2 = [], stack3 = [];
  var selectedStack;
  var newDeck = [];

  for(var i=1; i <= 27; i++) {
    var ind = i-1;
    if(ind < 0 || ind >= deck.length) { break; }

    switch(i%3) {
      case 0:
        stack3.push(deck[ind]);
        break;
      case 1:
        stack1.push(deck[ind]);
        break;
      case 2:
        stack2.push(deck[ind]);
        break;
    }
  }

  // --- TESTING - Display stacks
  //debug testing deck and layout
  console.log("---_Stacks-----");
  printDeck(stack1);
  printDeck(stack2);
  printDeck(stack3);
  console.log("---_____-----");
  // ---

  var stacks = [stack1,stack2,stack3];

  switch(stackPos) {
    case TOP:
      if( selColumn == 0 ) {
//        console.log("--DEBUG--stack choice 0");
        newDeck = stacks[0].concat(stacks[1]).concat(stacks[2]);
      } else if( selColumn == 1 ) {
//        console.log("--DEBUG--stack choice 1");
        newDeck = stacks[1].concat(stacks[0]).concat(stacks[2]);
      } else if( selColumn == 2) {
//        console.log("--DEBUG--stack choice 2");
        newDeck = stacks[2].concat(stacks[0]).concat(stacks[1]);
      }
      break;
    case MIDDLE:
      if( selColumn == 0 ) {
//        console.log("--DEBUG--stack choice 3");
        newDeck = stacks[1].concat(stacks[0]).concat(stacks[2]);
      } else if( selColumn == 1 ) {
//        console.log("--DEBUG--stack choice 4");
        newDeck = stacks[0].concat(stacks[1]).concat(stacks[2]);
      } else if( selColumn == 2) {
//        console.log("--DEBUG--stack choice 5");
        newDeck = stacks[0].concat(stacks[2]).concat(stacks[1]);
      }
      break;
    case BOTTOM:
      if( selColumn == 0 ) {
//        console.log("--DEBUG--stack choice 6");
        newDeck = stacks[1].concat(stacks[2]).concat(stacks[0]);
      } else if( selColumn == 1 ) {
//        console.log("--DEBUG--stack choice 7");
        newDeck = stacks[0].concat(stacks[2]).concat(stacks[1]);
      } else if( selColumn == 2) {
//        console.log("--DEBUG--stack choice 8");
        newDeck = stacks[0].concat(stacks[1]).concat(stacks[2]);
      }
      break;
  }
  return newDeck;

}


function getCardHTML(deckInd) {
  var col;
  var row = Math.ceil( (deckInd+1) / 3) ;

  var mod3 = (deckInd+1) % 3;
  switch (mod3) {
    case 0:
      col = "column3";
      break;
    case 1:
      col = "column1";
      break;
    case 2:
      col = "column2";
      break;
  }

  var colHTML = document.getElementById(col).getElementsByClassName("card")[row-1];
//  console.log(colHTML.innerHTML);
//  console.log(colHTML.getElementsByClassName("rank") +"" + colHTML.getElementsByClassName("suit"));
  return colHTML;
}


function setColumnStackOrder() {
  var mod3 = favoriteNumber % 3;

  switch (mod3) {
    case 0:
      columnStackOrder[0] = BOTTOM;
      break;
    case 1:
      columnStackOrder[0] = TOP;
      break;
    case 2:
      columnStackOrder[0] = MIDDLE;
      break;
  }

  var int3 = Math.ceil(favoriteNumber / 3) ;
  int3 = int3 % 3;

  switch (int3) {
    case 0:
      columnStackOrder[1] = BOTTOM;
      break;
    case 1:
      columnStackOrder[1] = TOP;
      break;
    case 2:
      columnStackOrder[1] = MIDDLE;
      break;
  }

  var int9 = Math.ceil(favoriteNumber / 9);


  switch (int9) {
    case 1:
      columnStackOrder[2] = TOP;
      break;
    case 2:
      columnStackOrder[2] = MIDDLE;
      break;
    case 3:
      columnStackOrder[2] = BOTTOM;
      break;
  }

  console.log("column Stack Order: " + columnStackOrder);
}


function reset() {
  console.log("reset");
  cardChosen = false;
  favoriteNumberSelected = false;
  columnChooseCount = 0;

  setupBoard();
}


function setupBoard() {
  deck = createDeck();
  shuffledDeck = shuffle(deck);
  trickDeck = []

  for(var i=0; i < 27; i++) {
   trickDeck[i] = shuffledDeck[i];
  }

  dealCards(trickDeck);
}


function dealCards(aDeck) {
  //set columnCard
  console.log("dealing cards...");
  var row = 0;
  for(var i=0; i < 25; i += 3) {
    var card1 = getCardRankSuit(aDeck[i]);
    var card2 = getCardRankSuit(aDeck[i+1]);
    var card3 = getCardRankSuit(aDeck[i+2]);


    setCard(0, row, card1.r, card1.s );
    setCard(1, row, card2.r, card2.s );
    setCard(2, row, card3.r, card3.s );

    row++;
  }

  //debug testing deck and layout
  printDeck(aDeck);

}

function getCardRankSuit(aCard) {
  var ret = {};
  ret.r = aCard.substr(0,aCard.length - 1);
  ret.s = aCard.substr(-1,1);

  return ret;
}


function printDeck(aDeck) {

  //debug testing deck and layout
  var s = "";
  for(i = 0; i< aDeck.length; i++) {
    s += getCardRankSuit(aDeck[i]).r;
    s += getCardRankSuit(aDeck[i]).s;
    s += ",";
  }
  console.log(aDeck.length + "   " + s);
  return s;

}

// ----------------------------

var deck; //= createDeck();
var shuffledDeck; // = shuffle(deck);
var trickDeck; // = []


reset();

STATErunCardSelection();

/*
Testing

print(trickDeck.length);
printDeck(trickDeck);
test = stackDeck(0,MIDDLE);
printDeck(test);

test = stackDeck(0,BOTTOM);
printDeck(test);

favoriteNumber;
columnStackOrder;
*/
