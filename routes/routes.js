var user = require('../modules/user/user');


module.exports = function router(app){
    app.use('/user',user);
};