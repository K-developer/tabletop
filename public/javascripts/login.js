//import * as lib from "lib.js";

//lib.emerald.log("here");
if(ajax_worker !== null){
	let ajax_worker = new SharedWorker("/javascripts/workers/ajax_worker.js");
}

cookie = emerald.cookie.retrieve();

function validate(obj){
	let data = obj;
	let regX = [];
	regX.push(/<([^>]+)>/);
	regX.push(/\/+/);
	regX.push(/"+/);
	regX.push(/'+/);
	for (let x in obj) {
		for(let i=0; i<regX.length; i++){
			obj[x].replace(regX[i], "");
		}
	}
	return data;
}

function login(){
	let login = {};
	login.name = document.getElementById("LoginName").value;
	login.pass = document.getElementById("LoginPass").value;


	login = validate(regi);
	ajax_worker.port.postMessage(["post", "/login", JSON.stringify(login)]);
	ajax_worker.port.onmessage =function(e){
		if(e.data !== null){
			let data = JSON.parse(e.data);
			cookie.name = data.name;
			cookie.type = data.type;
			cookie.path = "/";
			cookie.max_age = data.expires;
			
			if(data.error.length){
				//Handle Error here

			}

			json_to_cookie(cookie);	       
    };
	}
}

function register(){
	let regi = {};
	regi.name = document.getElementById("RegiName").value;
	regi.password = document.getElementById("RegiPass").value;
	regi.email = document.getElementById("RegiEmail").value;
	regi.player = document.querySelector("#RegiGm").checked ? "GM" : "player"

	regi = validate(regi);
	ajax_worker.port.postMessage(["post", "/register", JSON.stringify(regi)]);
	ajax_worker.port.onmessage =function(e){
		if(e.data !== null){
			let data = JSON.parse(e.data);
			cookie.name = data.name;
			cookie.type = data.type;
			cookie.path = "/";
			cookie.id = data.id;
			cookie.max_age = data.expires;
			emerald.cookie.store(cookie);
			emerald.showHide(loginBody);	       
    };
	}
	
}

function login(){
	let login = {};
	login.name = document.getElementById("LoginName").value;
	login.password = document.getElementById("LoginPass").value;

	login = validate(login);
	ajax_worker.port.postMessage(["post", "/login", JSON.stringify(login)]);
	ajax_worker.port.onmessage =function(e){
		if(e.data !== null){
			let data = JSON.parse(e.data);
			console.log(data);
			cookie.name = data.name;
			cookie.type = data.type;
			cookie.path = "/";
			cookie.id = data.id;
			cookie.logged_in = true;
			cookie.max_age = data.expires;
			emerald.cookie.store(cookie);
			emerald.showHide(loginBody);	       
    };
	}
	
}

document.getElementById("RegiSub").addEventListener("click", function(){
	console.log("Registering");
	register();

})

document.getElementById("LoginSub").addEventListener("click", function(){
	console.log("Logging in");
	login();

})

// document.getElementById("login").addEventListener("click", function(){
// 	let loginBody = document.getElementById("loginBody");
// 	emerald.showHide(loginBody);

// })