const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const comicRoutes = require('./api/routes/comics');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 1 * 60 * 1000, // Close sockets after 45 seconds of inactivity
    family: 4
};

mongoose.connect(
    'mongodb+srv://user1:mangojelly@mangojelly.soryufr.mongodb.net/?retryWrites=true&w=majority',options
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Origin','PUT, POST,PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use(bodyParser.json());
app.use('/comics', comicRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});

module.exports = app;