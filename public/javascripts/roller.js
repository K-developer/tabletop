var cookie = emerald.cookie.retrieve();

var populate = function() {
    let buttons = document.querySelector("#buttons");
    if (cookie.game === "gurps") {
        emerald.notify("Populating Gurps");
        buttons.innerHTML = '<button id="3d6">3D6 </button>\
            <button id="clear">  Clear</button>\
            <input id="numD6" min="1" value="1" type="number">\
            <button id="d6">D6</button>\
            <span>Modifier per Di</span>\
            <input id="perDi" placeholder="0" type="text">\
            <span>Modifier Dice Total</span>\
            <input id="diTot" placeholder="0" type="text">';
    } else {
        emerald.notify("Populating Other");
        buttons.innerHTML = '\
            <button id="d4">D4</button>\
            <button id="d6">D6</button>\
            <button id="d8">D8</button>\
            <button id="d10">D10</button>\
            <button id="d12">D12</button>\
            <button id="d20">D20</button>\
            <input id="numDi" type="number" min="1" value="1">\
            <button id="clear">  Clear</button>\
            <span>Modifier per Di</span>\
            <input id="perDi" placeholder="0" type="text">\
            <span>Modifier Dice Total</span>\
            <input id="diTot" placeholder="0" type="text">\
        ';
    }
}




document.addEventListener("populate", function(){
    cookie = emerald.cookie.retrieve();
    populate();
    diceRolling();
});




/*******************************************************/
/*                                                     */
/*        worker functions below                       */
/*                                                     */
/*******************************************************/


var diceRolling = function(){
    emerald.listener.removeAll(document.getElementById("buttons"));
    if (window.Worker) {
    var ajaxWorker = new Worker("/javascripts/workers/ajax_worker.js");
    var rollerWorker = new Worker("/javascripts/workers/roller_worker.js");
    if (cookie.game === "gurps") {

        document.getElementById("3d6").addEventListener("click", function() {
            var dice = {};
            dice.mod = {};
            dice.number = 3;
            dice.sides = 6;
            dice.mod.PerDi = document.getElementById("perDi").value * 1 || 0;
            dice.mod.tot = document.getElementById("diTot").value * 1 || 0;
            rollerWorker.postMessage(JSON.stringify(dice));
        });

        document.getElementById("d6").addEventListener("click", function() {
            var dice = {};
            dice.mod = {};
            dice.number = document.getElementById("numD6").value;
            dice.sides = 6;
            dice.mod.PerDi = document.getElementById("perDi").value * 1 || 0;
            dice.mod.tot = document.getElementById("diTot").value * 1 || 0;
            rollerWorker.postMessage(JSON.stringify(dice));
        });

        document.getElementById("clear").addEventListener("click", function() {
            document.getElementById("results").innerHTML = "";
        });

        ajaxWorker.onmessage = function(e) {
            document.getElementById("targ").innerHTML = e.data;
        }
    } else {
        try{
            document.getElementById("buttons").addEventListener("click", function(e) {
            if (e.target.tagName === "BUTTON") {
                if (e.target.id === "clear") {
                    document.getElementById("results").innerHTML = "";
                } else {
                    let dice = {};
                    dice.mod = {};
                    dice.number = document.getElementById("numDi").value;
                    dice.mod.PerDi = document.getElementById("perDi").value * 1 || 0;
                    dice.mod.tot = document.getElementById("diTot").value * 1 || 0;
                    dice.sides = e.target.id.replace(/[^0-9]/g, '');
                    rollerWorker.postMessage(JSON.stringify(dice));
                }

            }
        })
        }catch(err){}
        


        // ajaxWorker.onmessage = function(e) {
        //     document.getElementById("targ").innerHTML = e.data;
        // }
    }


    document.getElementById("clear").addEventListener("click", function() {
        document.getElementById("results").childNodes = [];
    });

}







    /*******************************************************/
    /*                                                     */
    /*        onmessage functions below                    */
    /*                                                     */
    /*******************************************************/
    rollerWorker.onmessage = function(e) {
        let targ = document.getElementById("results");
        let results = JSON.parse(e.data);
        //console.log(results);
        let start = document.createElement("ARTICLE");
        start.className = "rolls";
        //targ.appendChild(start);
        for (i = 0; i < results.mod.rolls.length; i++) {
            let x = i + 1;
            let cont = document.createElement("span")
            if (results.mod.modifiers.PerDi != 0) {
                cont.appendChild(document.createTextNode("Dice roll " + x + " (D" + results.sides + ")  : " + results.rolls[i] + "+" + results.mod.modifiers.PerDi + " : " + results.mod.rolls[i]));
            } else {
                cont.appendChild(document.createTextNode("Dice roll " + x + " (D" + results.sides + ")  : " + results.rolls[i]));
            }
            start.append(cont);
        }
        let totRow = document.createElement("span");
        if (results.mod.modifiers.tot != 0) {
            totRow.appendChild(document.createTextNode("Dice Roll Total: " + results.total + " + " + results.mod.modifiers.tot + " : " + results.mod.total));
        } else {
            totRow.appendChild(document.createTextNode("Dice Roll Total: " + results.total));
        }
        start.append(totRow);
        targ.prepend(start);

    }

}

populate();
diceRolling();