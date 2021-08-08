const express = require('express');
const usersController = require('./controllers/users-controller');
const cors = require('cors');
const errorHendler = require('./errors/error-handler');
const filter = require('./middleware/filter');
const http = require("http");
const socketIO = require("socket.io");
const fileUpload = require('express-fileupload')


const expressServer = express();
const httpServer = http.createServer(expressServer);
const socketServer = socketIO.listen(httpServer);

expressServer.use(fileUpload());
expressServer.use(express.json());
expressServer.use(cors());

let userIdToSocketsMap = new Map();

socketServer.sockets.on("connection", socket => {
  
    console.log("Connection request");
    var handshakeData = socket.request;
    let userId = handshakeData._query['userId'];

    console.log("User id: " + userId);
    userIdToSocketsMap.set(userId, socket);

    console.log("One client has been connected... Total clients: " + userIdToSocketsMap.size);

    socket.on("addResort", addResort => {
        console.log("socket add new resort")
        console.log(addResort)
        console.log("The new resort that add is: " + JSON.stringify(addResort));
        console.log(addResort)
        socket.broadcast.emit('addResort', addResort)
    });

    socket.on("deleteResort", deleteResort => {
        console.log("socket deleted resort")
        console.log(deleteResort)
        console.log("The deleted resort is: " + JSON.stringify(deleteResort));
        console.log(deleteResort)
        socket.broadcast.emit('deleteResort', deleteResort)
    });

    socket.on("updateResort", updateResort => {
        console.log("socket update resort")
        console.log(updateResort)
        console.log("The updated resort is: " + JSON.stringify(updateResort));
        console.log(updateResort)
        socket.broadcast.emit('updateResort', updateResort)
    });

    socket.on("followResort", followResort => {
        console.log("socket follow resort")
        console.log(followResort)
        console.log("The resort to follow is: " + JSON.stringify(followResort));
        console.log(followResort)
        socket.broadcast.emit('followResort', followResort)
    });

    socket.on("unFollowResort", unFollowResort => {
        console.log("socket unFollow resort")
        console.log(unFollowResort)
        console.log("The resort to unfollow is: " + JSON.stringify(unFollowResort));
        console.log(unFollowResort)
        socket.broadcast.emit('unFollowResort', unFollowResort)
    });

    socket.on("disconnect", () => {
        var handshakeData = socket.request;
        let userId = handshakeData._query['userId'];

        userIdToSocketsMap.delete(userId);
        console.log(userId + " has been disconnected. Total clients: " + userIdToSocketsMap.size);
    });

});

httpServer.listen(3002, () => {
    console.log('socket listening on port 3002');
})

expressServer.use(filter);

expressServer.use(cors({ origin: "http://localhost:3000", credentials: true }));

expressServer.use(express.json());

expressServer.use('/users', usersController);
expressServer.use(errorHendler);

expressServer.listen(3001, () => console.log(`Listening on http://localhost:3001`));
expressServer.use(express.static('./uploads'));
// expressServer.use(express.static(__dirname));

