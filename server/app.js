if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.MONGODB_URL)

app.use('/api/v1', require('./api/v1'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
