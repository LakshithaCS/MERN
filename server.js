const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const connectDB = require('./config/db')            //get DB
dotenv.config({path: './config/config.env'})        //get the configured env vars
connectDB();        //to connect the DB

const app = express();
const port = process.env.PORT || 5000;

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const auth = require('./routes/auth.routes')        //get routes
app.use('/api/auth',auth)       //get auth route

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
