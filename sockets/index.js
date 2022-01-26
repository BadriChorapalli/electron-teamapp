const app = require('express')();
const { exec } = require('child_process');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (client) => {
	console.log("new connection")
  io.emit('welcome');

  client.on("test", (msg) => {
    console.log("received test"); // not displayed
	console.log(msg)
    io.emit("ok");
  })
  client.on("mouseEvent", (clientX,clientY) => {
    console.log("Mouse"); // not displayed
	console.log(clientX+" : "+clientY)
	var str="java test "+clientX+" "+clientY;
	console.log(str);
	exec(str);
    io.emit(str);
  })
  
});
server.listen(7000);

/*const io = require('socket.io')();

io.on('connection', (client) => {
	console.log("new connection")
  io.emit('welcome');

  client.on("test", () => {
    console.log("received test"); // not displayed
    io.emit("ok");
  })
});

io.listen(18092);*/