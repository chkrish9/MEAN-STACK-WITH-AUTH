const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');



module.exports.configStrategy = function(app, passport){
    let opts = {};
    let token;
    let isDev = false;
    let isProd = true;
    let clientUrl=null;
    let serverUrl=null;

    if(isDev){
        serverUrl="http://localhost:3000";
        clientUrl="http://localhost:4200";
    }if(isProd){
        serverUrl=" https://meanstack-todos.herokuapp.com/";
        clientUrl=" https://meanstack-todos.herokuapp.com/";
    }else{
        serverUrl="";
        clientUrl="";
    }

    //Local
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        //console.log(jwt_payload);
        User.getUserById(jwt_payload._doc._id, (err, user)=>{
            if(err){
                return done(err, false);
            }else if(user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        });
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign(user, config.secret, {
                     expiresIn : 604800 //1week
                 });
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Google+ Stratagy
    passport.use(new GoogleStrategy({
        clientID: config.gpClientId,
        clientSecret: config.gpClientSecret,
        callbackURL: serverUrl+"/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
       //console.log(profile);
       User.getUserByEmail(profile.emails[0].value, (err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            }else{
                let newUser = new User({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    username : profile.displayName,
                    password : ""
                });

                User.addUser(newUser, (err, user) =>{
                    if(err){
                        return done(err, false);
                    }else{
                        return done(null, user);
                    }
                });
            }
        });
    }
    ));

    //FB Stratagy
    passport.use(new FacebookStrategy({
        clientID: config.fbClientId,
        clientSecret: config.fbClientSecret,
        callbackURL: serverUrl+"/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)', 'email','birthday'],
        enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log(profile);
        User.getUserByEmail(profile. _json.email, (err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                return done(null, user);
            }else{
                let newUser = new User({
                    name : profile. _json.name,
                    email : profile. _json.email,
                    username : profile. _json.name,
                    password : ""
                });

                User.addUser(newUser, (err, user) =>{
                    if(err){
                        return done(err, false);
                    }else{
                        return done(null, user);
                    }
                });
            }
        });
       
    }
    ));

    //Google+ routes
    app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile','email'] }));

    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/' }),(req, res)=> {
        // Successful authentication, redirect home.
        let user = {
            id : req.user._id,
            name : req.user.name,
            username : req.user.username,
            email : req.user.email
        }
        res.redirect(clientUrl+'/passport/'+'JWT '+token+'/'+JSON.stringify(user));
    });

    //FB routes
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),(req, res)=> {
        // Successful authentication, redirect home.
        let user = {
            id : req.user._id,
            name : req.user.name,
            username : req.user.username,
            email : req.user.email
        }
        res.redirect(clientUrl+'/passport/'+'JWT '+token+'/'+JSON.stringify(user));
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );
}
