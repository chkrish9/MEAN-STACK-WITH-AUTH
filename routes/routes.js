var user = require('../modules/user/user');
var home = require('../modules/home/home');

module.exports = function router(app){
    app.use('/user',user);
    app.use('/home',home);
};