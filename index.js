const express = require('express')

const route = require('./routers/client/index.route')

const app = express()
const port = 3000

app.set('views', './views');
app.set('view engine','pug');

route(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})