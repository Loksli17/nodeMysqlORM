const mongoose = require('mongoose');
const config   = require('../../config');

mongoose.connect(config.db.mongoose.url + config.db.mongoose.name, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Error with db" + err);
        throw err;
        return;
    }
    console.log('Connecton to datebase was success');
});

module.exports = mongoose;
