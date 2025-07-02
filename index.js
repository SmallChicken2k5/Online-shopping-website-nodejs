const express = require('express')
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');
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

//Flash message
app.use(cookieParser('afasdhgwerw'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash message

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

route(app);
adminRoute(app);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})