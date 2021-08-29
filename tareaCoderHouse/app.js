//Global require
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const emoji = require('node-emoji')

//Express
const app = express();

const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

httpServer.listen(8080,()=>{console.log('Server running on: http://localhost:8080/')})

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Sockets

const Contenedor = require('./controller/contenedor')
const contenedorProductos = new Contenedor('./tareaCoderHouse/db/product.json');
const contenedorMensajes = new Contenedor('./tareaCoderHouse/db/chat.json');

io.on('connection', async socket => {
  // PRODUCTOS
  const products = await contenedorProductos.getAll();
  socket.emit('productos', products);
  socket.on('nuevoProducto', async producto => {
    await contenedorProductos.saveProduct(producto);
    io.emit('productos', products);
  })
  // MENSAJES
  const messages = await contenedorMensajes.getAll();
  socket.emit('mensajes', messages);
  socket.on('nuevoMensaje', async msg => {
    msg.fyh = new Date().toLocaleString();
    await contenedorMensajes.saveProduct(msg);
    io.emit('mensajes', messages);
  })
});
app.get('/', (req, res) => {
	res.status(200).render('index');
})
app.get('/users', (req, res) => {
	res.status(200).render('chatbox');
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
