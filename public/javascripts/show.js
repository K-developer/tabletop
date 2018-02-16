let data;
let i = 0;

function callSheets() {
    let stats = data[i].stats;
    let adv = data[i].adv;
    let dis_adv = data[i].dis_adv;
    let skills = data[i].skills;
    let root = document.getElementById("dump");
    document.querySelector("#share").value = `http://k-developer.com/perma?name=${data[i].n.replace(" ", "%20")}&id=${data[i].player_id}`;

    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

    let name = document.createElement("h1");
    let name_cont = document.createTextNode(data[i].n);

    name.appendChild(name_cont);
    root.appendChild(name);

    let stat_root = document.createElement("div");
    stat_root.setAttribute("id", "stat_root");

    let stat_title = document.createElement("h1");
    let stat_title_cont = document.createTextNode("Stats");


    stat_title.appendChild(stat_title_cont);
    stat_root.appendChild(stat_title);

    let stat = document.createElement("div")
    stat.setAttribute("id", "stats");

    for (let x in stats) {
        let line = document.createElement("p")
        let lineOne = document.createTextNode(x + " : ")
        let lineTwo = document.createTextNode(stats[x]);
        line.appendChild(lineOne);
        line.appendChild(lineTwo);
        stat.appendChild(line);

    }

    stat_root.appendChild(stat);
    root.appendChild(stat_root);

    adv_root = document.createElement("div")
    adv_root.setAttribute("id", "adv_root")

    adv_title = document.createElement("h1");
    adv_title_cont = document.createTextNode("Advantages");

    adv_title.appendChild(adv_title_cont);
    adv_root.appendChild(adv_title);


    let advan = document.createElement("div");
    advan.setAttribute("id", "adv")
    advan.setAttribute("class", "show")

    for (a = 0; a < adv.length; a++) {
        let advantage = adv[a];
        var advantage_container = document.createElement("article");
        advantage_container.setAttribute("class", "item advantage");
        for (let y in advantage) {
            let line = document.createElement("p");
            let lineOne = document.createTextNode(emerald.capitalise(y) + " : ")
            let lineTwo = document.createTextNode(advantage[y]);
            line.appendChild(lineOne);
            line.appendChild(lineTwo);
            advantage_container.appendChild(line);
        }
        advan.appendChild(advantage_container);

    }

    adv_root.appendChild(advan);
    root.appendChild(adv_root);


    let dis_root = document.createElement("div");
    dis_root.setAttribute("id", "dis_root");

    let dis_title = document.createElement("h1");
    let dis_title_cont = document.createTextNode("Disadvantages");
    dis_title.appendChild(dis_title_cont);

    dis_root.appendChild(dis_title);

    let dadvan = document.createElement("div");
    dadvan.setAttribute("id", "dadv")
    dadvan.setAttribute("class", "show");

    for (d = 0; d < dis_adv.length; d++) {
        let disadvantage = dis_adv[d];
        let disadvantage_container = document.createElement("article");
        disadvantage_container.setAttribute("class", "disadvantage item");
        for (let z in disadvantage) {
            let line = document.createElement("p");
            let lineOne = document.createTextNode(emerald.capitalise(z) + " : ")
            let lineTwo = document.createTextNode(disadvantage[z]);
            line.appendChild(lineOne);
            line.appendChild(lineTwo);
            disadvantage_container.appendChild(line);
        }
        dadvan.appendChild(disadvantage_container);
    }
    dis_root.appendChild(dadvan);
    root.appendChild(dis_root);

    let skill_root = document.createElement("div");
    skill_root.setAttribute("id", "skill_root");

    let skill_title = document.createElement("h1");
    let skill_title_cont = document.createTextNode("Skills");

    skill_title.appendChild(skill_title_cont);
    skill_root.appendChild(skill_title);

    let skillCont = document.createElement("div");
    skillCont.setAttribute("id", "skill");
    skillCont.setAttribute("class", "show");

    for (s = 0; s < skills.length; s++) {
        let skill = skills[s];
        let skill_container = document.createElement("article");
        skill_container.setAttribute("class", "skill item"); 
        for (let w in skill) {
            let line = document.createElement("p");
            let lineOne = document.createTextNode(emerald.capitalise(w) + " : ")
            let lineTwo = document.createTextNode(skill[w]);
            line.appendChild(lineOne);
            line.appendChild(lineTwo);
            skill_container.appendChild(line);
        }
        skillCont.appendChild(skill_container);
    }
    skill_root.appendChild(skillCont);
    root.appendChild(skill_root);
    root.appendChild(document.createElement("hr"));
}

document.getElementById("prev").addEventListener("click", function() {
    if (!i <= 0) {
        i--
    }
    callSheets();
});

document.getElementById("next").addEventListener("click", function() {
    if (i < data.length - 1) {
        i = i + 1
    }
    console.log(i);
    callSheets();
});

document.getElementById("first").addEventListener("click", function() {
    i = 0;
    callSheets();
});

document.getElementById("last").addEventListener("click", function() {
    i = data.length - 1;
    callSheets();
});

document.querySelector("#share").addEventListener("click", function(event){
    document.execCommand("copy");
});

document.addEventListener("copy", function(event){
    let link = document.getElementById("share").value;
    event.clipboardData.setData("text/plain", link);
    emerald.notify("Copying link to clipboard");
    event.preventDefault();
})


emerald.ready(function() {
    if (localStorage.getItem("sheet_data") !== null) {
        console.log("using localStorage");
        data = JSON.parse(localStorage.getItem("sheet_data"));
        callSheets();
    } else {
        if (cookie.id) {
            ajax_worker.port.postMessage(["post", "/collect", JSON.stringify(cookie)]);
            //ajax_worker.port.postMessage(["post", "/collect", cookie.id]);
            ajax_worker.port.onmessage = function(e) {
                //localStorage.setItem("sheet_data", e.data);
                data = JSON.parse(e.data);
                console.log(data)
                callSheets();
            }
        } else {
        }

    }

    // document.querySelector("#stat_collapse").addEventListener("click", function() {
    //     emerald.showHide(document.getElementById("stats"));
    // });
    // document.querySelector("#adv_collapse").addEventListener("click", function() {
    //     emerald.showHide(document.getElementById("adv"));
    // });
    // document.querySelector("#dis_adv_collapse").addEventListener("click", function() {
    //     emerald.showHide(document.getElementById("dadv"));
    // });
    // document.querySelector("#skill_collapse").addEventListener("click", function() {
    //     emerald.showHide(document.getElementById("skill"));
    // });
});