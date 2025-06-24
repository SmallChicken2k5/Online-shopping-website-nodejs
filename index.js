const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const database = require('./config/database')
database.connect();
const route = require('./routers/client/index.route')



const app = express();
const port = process.env.PORT;

app.use(express.static('public'))
app.set('views', './views');
app.set('view engine','pug');

route(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})