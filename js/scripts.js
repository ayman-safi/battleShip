
var view = {

    displayMessage: function(msg){
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML=msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class","hit");
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute('class','miss');
    }

};

var model ={

    boardSize: 7,

    numShips: 3,

    shipLength:3,

    shipSunk: 0 ,

    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] },
             { locations: [0, 0, 0], hits: ["", "", ""] } ],

    fire: function(guess){
        for(var i =0 ; i<this.numShips ;i++){
            var ship= this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(index >=0){
                // there is a hit
                ship.hits[index]='hit';
                view.displayHit(guess);
                view.displayMessage(" hit !");
                if(this.isSunk(ship)){
                    view.displayMessage("you snak my ship !");
                    this.shipSunk++;
                }
                return true ;
            }
        }
        view.displayMiss(guess);
        view.displayMessage(' Miss !');
       
        return false ;
    } ,

    isSunk: function(ship){
        for(var i =0 ; i < this.numShips; i++){
            if(ship.hits[i] !== 'hit'){
                return false;
            }
        }

        return true;
    },

    generateShipLocation: function(){
        var locations ;
        for(var i = 0 ; i< this.numShips ; i++){
            do {
                locations = this.generateShip();
            } while(this.collision(locations));
            this.ships[i].locations= locations;
        }
    },

    generateShip:function(){
        var direction = Math.floor(Math.random()*2);
        var row , column ;

        if (direction === 1) {
            // Generate a starting location for a horizontal ship
            row = Math.floor(Math.random() * this.boardSize);
            column = Math.floor(Math.random() * (this.boardSize -3) );
            } else {
            // Generate a starting location for a vertical ship
            row = Math.floor(Math.random() * (this.boardSize -3) );
            column =Math.floor(Math.random() * this.boardSize);
            }

        var newShipLocations = [];

        for(var i = 0 ; i < this.shipLength ; i++){
            if(direction === 1){
                // Generate a starting location for a horizontal ship
                newShipLocations.push(row + "" + (column + i));
            }else {
                // Generate a starting location for a vertical ship
                newShipLocations.push((row + i) + "" + column );
            }
        }
        return newShipLocations ;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
            return true;
                }
            }
        }
    return false ;
    }

};

var controller = {

    guesses : 0 ,

    processGuess: function(guess){
        
        var location = parseGuess(guess);

        if(location){
            // it will count only the valid guesses 
            this.guesses++;

            // disblay the result of the guess on the board 
            var hit = model.fire(location);

            if (hit && model.shipSunk === model.numShips) {
                view.displayMessage("  you snak all the ship un only  " + this.guesses + " guesses ");
            }
        }
    }
};

function parseGuess(guess){
    var alephabet =['A','B','C','D','E','F','G'];
    if(guess === null || guess.length !== 2){
        alert('oops , please enter a letter and a number on the board ') ;
    }else {
        // take the first char of our guess to convert it to number as our id
        firstChar = guess.charAt(0);
        var row = alephabet.indexOf(firstChar);
        var column = guess.charAt(1) ;

        // check the validation of user guess
        if (isNaN(row) || isNaN(column)){
            alert("Oops, that isn't on the board.");
        } else if( row <0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert("Oops, that isn't on the board. ");
        }else {
            return row + column ;
        } 
    }

    return null ; 

};

function handleFireButton(){
    var guessInput = document.getElementById('guessInput') ;
    var guess = guessInput.value ;
    controller.processGuess(guess);
    guessInput.value ="";

}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
    fireButton.click();
    return false;
    }
}

function init(){
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick= handleFireButton ;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocation();
}

 window.onload= init ; 





























