const { Schema, model } = require('mongoose')

const GenreData = new Schema({
  genreName: String,
  musics: [String]
})

module.exports = model('MusicData', GenreData)
