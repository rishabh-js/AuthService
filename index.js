const app = require('./express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth').then(() => {
    console.log('connected to database successfully')
}).catch((e) => {
    console.log(e);
});

app.listen(process.env.PORT || 3000, function(){
    console.log('app is running successfully');
});