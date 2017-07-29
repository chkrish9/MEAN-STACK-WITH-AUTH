const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports.configFbStrategy = function(app,passport){
    let token;
    let isDev = false;
    let clientUrl=null;
    let serverUrl=null;

    if(isDev){
        serverUrl="http://localhost:3000";
        clientUrl="http://localhost:4200";
    }else{
        serverUrl="";
        clientUrl="";
    }

    passport.serializeUser(function(user, done) {
        token = jwt.sign(user, config.secret, {
                     expiresIn : 604800 //1week
                 });
        done(null, token);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new FacebookStrategy({
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: serverUrl+"/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email','birthday'],
        enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        done(null, profile);
    }
    ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),(req, res)=> {
        // Successful authentication, redirect home.
        res.redirect(clientUrl+'/passport/'+'JWT '+token);
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );

    
}