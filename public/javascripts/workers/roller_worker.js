onmessage = function(e){
    
    var dice, results, total;
    dice = JSON.parse(e.data);
    results = {};
    results.rolls = [];
    results.mod = {};
    results.mod.rolls = [];
    results.total = 0;
    results.mod.total = 0;
    
    for(i=0; i < dice.number; i++){
        var roll = Math.floor(Math.random() * dice.sides)+1;
        results.rolls.push(roll);
        results.mod.rolls.push(roll+dice.mod.PerDi);
        results.total += (roll+dice.mod.PerDi);
    }
    results.mod.total = results.total+dice.mod.tot;
    results.mod.modifiers = dice.mod;
    results.sides = dice.sides;
    postMessage(JSON.stringify(results));
}
