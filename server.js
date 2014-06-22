// JavaScript Document

var ws = require("nodejs-websocket");
licznik = 0;
var server = ws.createServer(function(conn) {
	
    conn.on("text", function(data) {

        var dataObject = JSON.parse(data);
		console.log(dataObject.type);
        if(dataObject.type == "join") {
            conn.nickName = dataObject.name;
			licznik++;
			console.log(licznik + " gracz/y");
            sendToAll({
                type: "status",
                message: conn.nickName,
				licznik: licznik
            });
        } else if(dataObject.type == "message") {
            sendToAll({
                type: "message",
                name: conn.nickName,
                message: dataObject.message
            });
        } else if(dataObject.type == "sprawdz") {
            sendToAll({
                type: "sprawdz",
                name: conn.nickName,
                position: dataObject.position
            });
        }else if(dataObject.type == "trafiony") {
            sendToAll({
                type: "trafiony",
                name: conn.nickName,
                x: dataObject.x,
				y: dataObject.y,
				lewa_gora: dataObject.lewa_gora,
				gora: dataObject.gora,
				prawa_gora: dataObject.prawa_gora,
				lewa: dataObject.lewa,
				prawa: dataObject.prawa,
				lewy_dol: dataObject.lewy_dol,
				dol: dataObject.dol,
				prawy_dol: dataObject.prawy_dol
            });
        }else if(dataObject.type == "nie_trafiony") {
            sendToAll({
                type: "nie_trafiony",
                name: conn.nickName,
                x: dataObject.x,
				y: dataObject.y
            });
        }else if(dataObject.type == "end") {
            sendToAll({
                type: "end",
                name: conn.nickName
            });
        }

    });

    conn.on("close", function() {

        if(conn.nickName) {
			licznik--;
			console.log(licznik + " gracz/y");
            sendToAll({
                type: "status_quit",
                message: conn.nickName + " opuścił/a grę."
            });
        }

    });

    conn.on("error", function(e) {
        console.log("Nieoczekiwanie przerwano połączenie!");
    });

}).listen(8001, "192.168.0.200", function() {
    console.log("Serwer aktywny!");
});

function sendToAll(data) {

    var msg = JSON.stringify(data);

    server.connections.forEach(function(conn) {
        conn.sendText(msg);
    });

}
