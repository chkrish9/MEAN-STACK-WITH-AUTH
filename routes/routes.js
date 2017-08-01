var user = require('../modules/user/user');
var todo = require('../modules/todo/todo');
var session = require('express-session');
module.exports = function router(app){
    app.use('/user',user);
    app.use('/todo',todo);
};