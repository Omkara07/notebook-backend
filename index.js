const connectTOMongo = require('./db')
const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())
connectTOMongo();

const port = 5000

app.use(express.json())

// available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})