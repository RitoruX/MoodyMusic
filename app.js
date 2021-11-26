require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')

const app = express()
app.use(expressLayouts)
app.use(express.static('public'))

app.set('view engine', 'ejs')
app.set('layout extractScripts', true)

mongoose.connect(process.env.MONGODB_URL)

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/history', (req, res) => {
  res.render('history')
})

app.use('/api/v1', require('./api/v1'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
