const connectTOMongo = require('./db')
const express = require('express')
var cors = require('cors')
// const axios  = require('axios')
const app = express()

app.use(cors({
  origin: "https://notebook-frontend-five.vercel.app",
  methods:["POST","GET"],
     credentials: true

}))
connectTOMongo();

const port = 5000

app.use(express.json())

// app.get('/api/:endpoint*', async (req, res) => {
//   try {
//     const endpoint = req.params.endpoint + (req.params[0] || '');
//     const response = await axios.get(`https://api.rawg.io/api/${endpoint}`, {
//       params: { ...req.query, key: process.env.VITE_GAMES_API_KEY },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: `${error.message}` });
//   }
// });

// available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})