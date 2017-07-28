const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const router = require('./routes/routes');
const passportConfig = require('./config/passport');

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
const port = 3000;

//Cors 
app.use(cors());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body parser
app.use(bodyParser.json());

//Passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig.configJWTStrategy(passport);

router(app);

app.get("/", (req, res)=>{
    res.send("Hello");
});

//Start server
app.listen(port, () => {
    console.log("Server running in :" + port);
});