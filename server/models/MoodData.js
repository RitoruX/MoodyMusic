const { Schema, model } = require('mongoose')

const MoodData = new Schema({
  moodName: String,
  musics: [String]
})

module.exports = model('MoodData', MoodData)
