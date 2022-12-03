const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cookieParser());


app.use('/v1/user', require('./router/user'));

//404
app.use(function(req, res, next) {
    const message = 'Requested route doesn\'t exists';
    const err = new Error(message);
    err.status = 404;
    next(err);
});

//error handling
app.use(function(err, req, res, next){
    const status = err.status || 500;
    const message = err.message;
    if(process.env.NODE_ENV === 'production') {
        console.log({err: message});
        res.status(status).json({err: message});
    } else {
        res.status(status).json(err.stack);
    }
});

module.exports = app;