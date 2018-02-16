onconnect = function(e) {
    var port = e.ports[0];
    console.log(e.data);
    port.onmessage = function(e) {
        var xhttp = new XMLHttpRequest();
        if (e.data[0] === "post") {
            xhttp.addEventListener('readystatechange',function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    port.postMessage(xhttp.response);
                }
            })
            xhttp.open("POST", e.data[1], true);
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhttp.send(e.data[2]);
        } else if (e.data[0] === "get") {
            xhttp.addEventListener('readystatechange',function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    port.postMessage(xhttp.response);
                }
            })
            xhttp.open("GET", e.data[1]);
            xhttp.send();
        }
    }
}