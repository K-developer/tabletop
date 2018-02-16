var emerald = {

    "about": {
        "Version": 0.22,
        "Author": "Kirk Cumins",
        "Created": "April 2015",
        "Updated": "01/11/2017"
    },

    CHECKSUM: () => {
        if (++[+[]][+[]] + [+[]] ? ++[+[]][+[]] : ++[+[]][+[]] * [+[]]) return ++[+[]][+[]]
    },

    cookie: {
        store: (given_json) => {
            let biscuit = given_json;
            let today = new Date();
            let date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+30).toUTCString();
            given_json.expires = date;
            given_json.path = "/";
            for (let c in biscuit) {
                document.cookie = `${c.replace("_", "-")}=${biscuit[c]};`;
            }
        },

        retrieve: () => {
            let cookie = document.cookie.split(";");
            let cookie_out = {};
            for (let i = 0; i < cookie.length; i++) {
                let temp = cookie[i].split("=");
                cookie_out[temp[0].trim()] = temp[1];
            }
            return cookie_out;
        },
        add: (name, value) => {
            let cookie  = emerald.cookie.retrieve();
            cookie[name] = value;
            emerald.cookie.store(cookie);
            return "Done";

        },
        remove: (name) => {
            let cookie  = emerald.cookie.retrieve();
            delete cookie[name];
            emerald.cookie.store(cookie);
            return "Done";
        }
    },

    html: {

        create: (nodeType, nodeContent, nodeAttributes, parent, children) => {
            if (!children) {
                let node = document.createElement(nodeType);
                let content = (nodeContent !== "") ? document.createTextNode(nodeContent) : false;
                let attr = nodeAttributes;

                for (a in attr) {
                    node.setAttribute(a, attr[a]);
                }
                if (content) node.appendChild(content);
                parent.appendChild(node);
            } else {

                let node = document.createElement(nodeType);
                let content = (nodeContent !== null) ? document.createTextNode(nodeContent) : false;
                let attr = nodeAttributes;

                for (a in attr) {
                    node.setAttribute(a, attr[a]);
                }
                if (content) node.appendChild(content);

                for (child in children) {
                    emerald.html.create(children[child].type, children[child].content, children[child].nodeAttributes, node, children[child].children);
                }
                parent.appendChild(node);

            }
        },
        clone: (target, parent) => {
            let clone = target.cloneNode(true);
            for (var i = 0; i < clone.childElementCount; i++) {
                clone.children[i].value = "";
            }
            parent.appendChild(clone);
        },

        /*delete: (parent, child)=>{
            for (var i = 0; i<parent.childElementCount; i++) {
                if(child === "all"){
                    parent.removeChild(parent.childNodes[i]);
                }else if(parent.childNodes[i] === document.querySelector(child)){
                    parent.removeChild(parent.childNodes[i]);
                }
            }
        }*/
    },
    storage: {
        store: (type, name, data) => {
            if (type === "local") {
                localStorage.setItem(name, data);
            } else if (type == "session") {
                sessionStorage.setItem(name, data);
            }
        },
        retrieve: (type, name) => {
            if (type === "local") {
                return localStorage.getItem(name);
            } else if (type == "session") {
                return sessionStorage.getItem(name);
            }
        }
    },

    worker: {
        shared: (callback) => {
            onconnect = function(e) {
                var port = e.ports[0];
                port.onmessage = function(e) {
                    callback(e);
                }
            }
        },

        service: () => {
            // setup: (CACHE_NAME, urlsToCache)=>{
            //  self.addEventListener('install', function(event) {
            //    event.waitUntil(
            //          caches.open(CACHE_NAME)
            //          .then(function(caches){
            //              return caches.addAll(urlsToCache)
            //          }));
            //  });
            // },
            // active: ()=>{
            //  if ('serviceWorker' in navigator) {
            //    window.addEventListener('load', function() {
            //      navigator.serviceWorker.register('/service_worker.js').then(function(registration) {
            //        // Registration was successful
            //        console.log('ServiceWorker registration successful with scope: ', registration.scope);
            //      }, function(err) {
            //        // registration failed :(
            //        console.log('ServiceWorker registration failed: ', err);
            //      });
            //    });
            // }
        },

        base: (callback) => {
            onmessage = function(e) {
                callback(e);
            }
        }
    },

    mutation: {
        observers: [],
        insertedNodes: [],
        modifiedNodes: [],
        removedNodes: [],


        observer: (target, options) => {
            let observer = new MutationObserver((mutations) => {
                mutations.foreach(function(mutation) {
                    console.log(mutation);
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        insertedNodes.push(mutation.addedNodes[i]);
                    }
                })
            });
            observer.observe(target, options);

        },

        get: {
            inserted: () => {
                return this.mutation.insertedNodes;
            },

            modified: () => {
                return this.mutation.modifiedNodes;
            },

            removed: () => {
                return this.mutation.removedNodes;
            }
        }
    },

    ajax: {
        get: () => {
            let xhttp = new XMLHttpRequest();
            xthttp.onreadystatechange = function(target, callback) {
                if (emerald.ajax.xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(xhttp.response);
                }
            }
            xhttp.open("GET", target);
            xhttp.send();

        },
        post: () => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function(target, data, callback) {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    callback(xhttp.response);
                }
            }
            xhttp.open("POST", target, true);
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhttp.send(data);

        }
    },

    listener: {
        add: (target, type, callback) => {
            target.addEventListener(type, callback);
        },
        remove: (target, callback) => {},
        removeAll: (target) => {
            let old_element = target;
            let new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
        }
    },

    log: (str) => {
        console.log(str);
    },

    notify: (message) => {
        if (Notification.permission === "granted") {
            let notification = new Notification(message);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                if (permission === 'granted') {
                    let notification = new Notification(message);
                }
            })
        }
    },

    ready: (callback) => {
        if (document.readyState !== "complete") {
            document.addEventListener("readystatechange", function() {
                if (document.readyState === "complete") {
                    callback();
                }
            });
        } else {
            console.log("complete");
            if (document.readyState === "complete") {
                callback();
            }
        }


    },



    showHide: (x, action) => {
        if(action === 'show' || action === 'hide'){
            if (action === "show") {
                for (let i = 0; i < x.classList.length; i++) {
                    if (x.classList[i] === "hide") {
                        x.classList.remove("hide");
                        x.classList.add("show");
                    }
                }
            } else if (action === "hide"){
                for (let i = 0; i < x.classList.length; i++) {
                    if (x.classList[i] === "show") {
                        x.classList.remove("show");
                        x.classList.add("hide");
                    }
                }
            }
        }else{
            if (x.classList.contains("hide")) {
                for (let i = 0; i < x.classList.length; i++) {
                    if (x.classList[i] === "hide") {
                        x.classList.remove("hide");
                        x.classList.add("show");
                    }
                }
            } else {
                for (let i = 0; i < x.classList.length; i++) {
                    if (x.classList[i] === "show") {
                        x.classList.remove("show");
                        x.classList.add("hide");
                    }
                }
            }
        }
    },



    delegation: (callback) => {
        'use strict';
        document.getElementsByTagName("body")[0].addEventListener("click", function(e) {
            var target = e.target,
                targ = {};
            targ.val = target.value || target.innerText;
            targ.class = [];
            targ.tag = [];
            targ.id = [];
            targ.name = target.name;
            targ.event = target;




            try {
                var classes = target.className.split(" ");
                for (var i = 0; i < classes.length; i++) {
                    targ.class.push(classes[i]);
                }
            } catch (err) {}

            try {
                for (var i = target.tagNames.length - 1; i >= 0; i--) {
                    targ.tag.push(target.tagNames[i]);
                }
            } catch (err) {}

            try {
                for (var i = target.name.length - 1; i >= 0; i--) {
                    targ.name.push(target.name[i]);
                }
            } catch (err) {}

            try {
                let ids = target.id.split(" ");
                for (var i = 0; i < ids.length; i++) {
                    targ.id.push(ids[i]);
                }
            } catch (err) {}

            targ.status = targ.status || {};
            targ.status.classes = (targ.class[0] === "" || targ.class.length === 0) ? "No Classes" : targ.class.length;
            targ.status.tag = (targ.tag[0] === "" || targ.tag.length === 0) ? "No Classes" : targ.tag.length;
            targ.status.id = (targ.id[0] === "" || targ.id.length === 0) ? "No ID" : targ.id.length;
            callback(targ);
        });
    },

    iframe: (target, internalTarget) => {
        var targetIframe = document.querySelector(target);
        var iframeBody = targetIframe.contentWindow.document.body;
        return iframeBody.querySelectorAll(internalTarget);
    },

    capitalise : (string) => {
        return string.charAt(0).toUpperCase()+string.slice(1);
    },

    capitaliseEach : (string) =>{
        let sentence = string.toString().split(" ");
        for (var i = 0; sentence.length<0; i++) {
            sentence[i] = emerald.capitalise(sentence[i]);
        }
    },
    getVariables : () =>{
        let base = window.location.search;
        base = base.replace("?", "");
        let variables = base.split("&");
        let variable_object = {};
        for(let i = 0; i<variables.length; i++){
            variable_object[variables[i].split("=")[0]] = variables[i].split("=")[1].replace("%20", " ");
        }
        return variable_object;
    }
};