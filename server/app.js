if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))

app.use('/api/v1', require('./api/v1'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
