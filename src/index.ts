'use-strict';
import {server as WebSocketServer} from 'websocket';
import http from 'http';
const PORT = process.env.PORT || 8080;

const server = http.createServer(function(request,response){
    response.writeHead(404);
    response.end();
});

server.listen(PORT,function(){
    console.log((new Date() + ' Server is listening on port ' + PORT))
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true // Change to false in prod.
});

wsServer.on('connect',function(connection){
    connection.send("Connected");
    connection.on('message',function(message){
        console.log(message);
    });
});

wsServer.on('request',function(request){
    console.log(request);
});


