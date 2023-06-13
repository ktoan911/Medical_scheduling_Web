const express = require('express');
const configViewEngine = require('./config/viewEngine');
const initWebRoute = require('./route/web');
var bodyParser = require('body-parser');
const connecDB = require('./config/connectDB');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setup view engine
configViewEngine(app);
initWebRoute(app);

connecDB();


//handle 404 Not Found
app.use((req, res) => {
    res.send('404 Not Found');
})

app.listen(port, () => {
    console.log(`Server chạy thành công trên cổng ${port}!!!`)
})