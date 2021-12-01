const { Schema, model } = require('mongoose')

const MoodTag = new Schema({
    moodName: String,
    tags: [String]
})

module.exports = model('MoodTag', MoodTag)