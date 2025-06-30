const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('dotenv').config()
const database = require('./config/database')
database.connect();
const route = require('./routers/client/index.route')
const adminRoute = require('./routers/admin/index.route')

const systemConfig = require('./config/system');

const app = express();
app.use(methodOverride('_method'))
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('views', './views');
app.set('view engine','pug');

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
adminRoute(app);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})