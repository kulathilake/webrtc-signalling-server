'use-strict';
import {server as WebSocketServer, } from 'websocket';
import http from 'http';
import { Signal } from './types';
import PeerConnectionQueue from './conn-queue';
import handleInitRequests from './handlers/init-handler';
const PORT = process.env.PORT || 8080;
const connQueue = new PeerConnectionQueue();
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
        const encoder = new TextDecoder('utf-8');
        try{
            const data:Signal<any> = JSON.parse(message.utf8Data);
            switch(data.type){
                case 'init':
                    handleInitRequests(data.payload,connQueue, connection);
                    break;
                case 'candidate':
                    break;
                case 'description':
                    break;
                case 'terminate':
                    
                    break;
                case 'info':
                    break;
            }
        }catch(error){
            console.log(error);
        }
    });
});

wsServer.on('request',function(request){
    console.log(request);
});



