let adv = document.getElementById("advantages");
let dis_adv = document.getElementById("disadvantages");
let skills = document.getElementById("skills");
let points, buyback, totalPoints, currentPoints, pointsUsed = {'adv': [],'dsv': [],'skl': [] };

const save_page = function(){
    sheet = {};
    sheet.stats = {};
    
    let meta = document.getElementById("meta-stats").getElementsByTagName("input");
    sheet.pointTotal = meta[0].value*1;
    sheet.buyback = meta[1].value*1;
    sheet.n = meta[2].value
    
    
    let stats = document.getElementById("stats");
    let stats_sel = stats.getElementsByTagName("select");
    let stats_inp = stats.getElementsByTagName("input");
    sheet.stats.st = stats_inp[0].value;
    sheet.stats.dx = stats_inp[1].value;
    sheet.stats.iq = stats_inp[2].value;
    sheet.stats.ht = stats_inp[3].value;
    sheet.stats.age = stats_inp[4].value;
    sheet.stats.size_mod = stats_inp[5].value;
    sheet.stats.height = stats_sel[0].value;
    sheet.stats.weight = stats_sel[1].value;
    
    sheet.adv = [];
    let advantages = adv.getElementsByClassName("adv");
    for(i=0; i<advantages.length; i++){
        let ad = advantages[i].getElementsByTagName("input");
        let adDesc = advantages[i].getElementsByTagName("textarea")[0];
        let av = {"name": ad[0].value, "points": ad[1].value*1, "level":ad[2].value*1, "desc": adDesc.value};
        sheet.adv.push(av);
    }
    
    
    
    sheet.dis_adv = [];
    let disadvantages = dis_adv.getElementsByClassName("dis_adv");
    for(i=0; i<disadvantages.length; i++){
        let dad = disadvantages[i].getElementsByTagName("input");
        let dadDesc = disadvantages[i].getElementsByTagName("textarea")[0];
        let dav = {"name": dad[0].value, "points": dad[1].value*1, "level":dad[2].value*1, "desc": dadDesc.value};
        sheet.dis_adv.push(dav);
    }
    
    
    sheet.skills = [];
    let skill = skills.getElementsByClassName("skill");
    for(i=0; i<skill.length; i++){
        let sk = skill[i].getElementsByTagName("input");
        let sk_lvl =  skill[i].getElementsByTagName("select");
        let skl = {"name": sk[0].value, "level": sk[1].value*1, "difficulty": sk_lvl[0].value};
        sheet.skills.push(skl);
    }
    if(cookie.id){
        sheet.player_id = cookie.id;
    }

    return sheet;
}


const updateCurrentPoints = function(){
    currentPoints = totalPoints;
    var sheet_update = save_page();
    console.log(sheet_update);

    for(items in sheet_update.adv){
        var adv_point = sheet_update.adv[items].level*sheet_update.adv[items].points || 0;
        pointsUsed.adv.push(adv_point);
    }

    for(items in sheet_update.dis_adv){
        var dis_point = sheet_update.dis_adv[items].level*sheet_update.dis_adv[items].points || 0;
        pointsUsed.dsv.push(dis_point);
    }

    for(numbers in pointsUsed){
        if(pointsUsed[numbers].constructor === Array){
            currentPoints = currentPoints - pointsUsed[numbers].reduce((tot, curr) => {tot+curr});
        }else{
            currentPoints = currentPoints - pointsUsed[numbers];
        }
        
    }
}


const adv_dsv_router = function(value, id){
    if(id==="adv"){
        pointsUsed.adv.push(value);
    }else if(id==="dis_adv"){
        pointsUsed.dsv.push(value);
    }else if(id==="skills"){
        pointsUsed.skl.push(value);
    }

}

const add_stats = function(title, num){
    pointsUsed[title] = num;
    updateCurrentPoints();
}


document.getElementById("save").addEventListener("click", function(){
    var sheet_to_save = save_page();
    console.log(sheet_to_save);
    ajax_worker.port.postMessage(["post", "/save", JSON.stringify(sheet_to_save)]);
});

document.getElementById("new_adv").addEventListener("click", function(){
    emerald.html.clone(adv.getElementsByClassName("adv")[0], adv);
    
});

document.getElementById("new_dis_adv").addEventListener("click", function(){
    emerald.html.clone(dis_adv.getElementsByClassName("dis_adv")[0], dis_adv);
});

document.getElementById("new_skl").addEventListener("click", function(){
    emerald.html.clone(skills.getElementsByClassName("skill")[0], skills);
});

document.getElementById("points").addEventListener("change", function(){
    points = this.value * 1;
    totalPoints = points * (1+(buyback /100)) || points;
    totalPoints = Math.ceil(totalPoints);
    current_points = totalPoints;
    document.getElementById("pointTotal").innerText = totalPoints;
})

document.getElementById("buyback").addEventListener("change", function(){
    buyback = this.value * 1;
    totalPoints = points * (1+((buyback /100))) || 0;
    totalPoints = Math.ceil(totalPoints);
    currentPoints = totalPoints;
    document.getElementById("pointTotal").innerText = totalPoints;
})

ajax_worker.port.onmessage = function(e){
    if(e.data === "data Stored"){
        console.log("Saved");
    };
};


let stat_input = document.getElementById("stats").querySelectorAll("input");
for (var i = 0; i<4; i++) {
    stat_input[i].addEventListener("change", (event)=>{
        if(event.target.name === "st" || event.target.name ===  "ht"){
            event.target.nextSibling.innerText = (event.target.value-10)*10;
            updateCurrentPoints(event.target.name, (event.target.value-10)*10);
        }else{
            event.target.nextSibling.innerText = (event.target.value-10)*20;
            updateCurrentPoints(event.target.name, (event.target.value-10)*20);
        }
    })

}


let adv_dsv = document.querySelectorAll('input[type="number"');
for (var i = adv_dsv.length - 1; i >= 0; i--) {
    adv_dsv[i].addEventListener("change", (event)=>{
        adv_dsv_router(event.target.value, event.target.parentNode.className)
    });
}