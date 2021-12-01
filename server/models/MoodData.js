const { Schema, model } = require('mongoose')

const MoodData = new Schema({
    genreName: String,
    musics: [String]
})

module.exports = model('MoodData', MoodData)