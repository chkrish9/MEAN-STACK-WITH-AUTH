const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const router = require('./routes/routes');
const passportConfig = require('./config/passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//DB Connection
mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log("Database :"+ config.database +" connection successfully");
});

mongoose.connection.on('error', (err) => {
    console.log("Database :"+ config.database +" connection failed. Reason :"+ err);
});

const app = express();

//Port numb
var port = process.env.PORT || 3000;

//Cors 
app.use(cors());

//Body parser
app.use(bodyParser.json());

app.use(cookieParser());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(session({
  secret: 'mysupersecret', 
  resave: true, 
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection,ttl: (1 * 60 * 60) }),
  cookie: { maxAge: 3600000,secure: false, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig.configStrategy(app,passport);


router(app);

//Required for navigating angular routes without server routes
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start server
app.listen(port, () => {
    console.log("Server running in :" + port);
});