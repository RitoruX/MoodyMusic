require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')

const app = express()
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
mongoose.connect(process.env.MONGODB_URL)

app.get('/', (req, res) => {
  res.render('index')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
