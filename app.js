var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let fs = require('fs');
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


let redireciona = require('./controllers/redireciona.js');
redireciona.redireciona()



setInterval(async () => {
    let hoje = new Date()
    let horas = (hoje.getHours())
    let minutos = (hoje.getMinutes())
    if(minutos == 48 || minutos == 49 ){
        if(horas == 3){
            redireciona.redireciona()
        }
    }

}, 120000);
//3600000000
module.exports = app;