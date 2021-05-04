const express = require('express');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const PassportLocal =require('passport-local').Strategy;
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');
var exec = require('child_process').exec;

// Create shutdown function
function shutdown(callback){
    exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
}

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = SocketIO.listen(server);


app.use(express.urlencoded({ extended: true}));

app.use(cookieparser('pass'));


app.use (session({

	secret:'pass',
	resave:true,
	saveUninitialized:true
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){

	if(username== "labestructuras" &&  password == "uquindio")

		return done(null,{id:1,name:"cody"});


	done(null,false);

}));

passport.serializeUser(function(user,done){

	done(null,user.id);


});

passport.deserializeUser(function(id,done){

	done(null,{id: 1, name :"cody"});


});

app.get("/",(req,res,next)=>{
	
	if (req.isAuthenticated())return next();
	res.redirect("/login");


	},(req,res)=>{

		res.sendFile(__dirname + '/views/interfaz.html')


});


app.get("/login",(req,res)=>{
	res.sendFile(__dirname + '/views/entrar.html')
})

app.post("/login",passport.authenticate('local',{

successRedirect:"/",
failureRedirect:"/login"

}));

app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

server.listen(3000, () => console.log('server on port 3000'));
//app.listen(8080,()=>console.log("server"));

const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

const port = new SerialPort("/dev/ttyUSB0", 
//const port = new SerialPort("/dev/ttyACM0", 
{
  baudRate: 9600
});

const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));

io.on('connection', function(socket) {
 console.log('Alguien se ha conectado con Sockets');
  

  socket.on('mover', function(data) 
  {
    console.log(data);
    if (data =='z' ){
	shutdown(function(output){
	console.log(output);
	});    
	    
	} 
    port.write(data);//manda al arduino  el dato recibido desde  la interfaz
     

  
  });
});

parser.on('data', function (data) //recibe  los datos del arduino  y los envia a la intterfaz
{
  var datos = data.split(",", 3);
  io.emit('arduino', datos);
});
