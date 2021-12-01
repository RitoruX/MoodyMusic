const router = require('express').Router()
const MoodData = require('./models/MoodData')
const MoodTag = require('./models/MoodTag')
const axios = require('axios')

const API_KEY = process.env.API_KEY
const SHEET_ID = '19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU'
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:Z?key=${API_KEY}`

router.get('/load-users-music-data', async(req, res) => {
    const response = await axios.get(SHEET_URL)
    const spreadsheetData = response.data.values
    const genreData = {}

    for (let i = 1; i < spreadsheetData.length; i++) {
        const genreName = spreadsheetData[i][5]
        const musicName = spreadsheetData[i][6]
        if (genreName in genreData) {
            genreData[genreName] = [...genreData[genreName], musicName]
        } else {
            genreData[genreName] = [musicName]
        }
    }

    try {
        for (const genreName in genreData) {
            const genre = new MoodData({
                    genreName,
                    musics: genreData[genreName]
                })
                // await genre.save()
            console.log(genre)
        }
        res.status(201).json({ message: 'Load mood data successfully' })
    } catch {
        res.status(400).json({ message: 'Error' })
    }
})

router.get('/load-mood-tag-data', async(req, res) => {
    const users_data = await MoodData.find({})
    const moodTag = {}

    for (var element of users_data) {
        for (var music of element.musics) {
            var music_request = await axios.get(
                encodeURI(`https://api.mixcloud.com/search/?q=${music}&type=cloudcast`)
            )
            var music_info = music_request.data
            if (music_info.data.length > 0) {
                for (const info of music_info.data) {
                    for (const tag of info.tags) {
                        if (element.genreName in moodTag) {
                            moodTag[element.genreName] = [...moodTag[element.genreName], tag.name]
                        } else {
                            moodTag[element.genreName] = [tag.name]
                        }
                    }
                }
            }
        }
    }
    try {
        for (const moodName in moodTag) {
            const genre = new MoodTag({
                moodName,
                tags: moodTag[moodName]
            })
            await genre.save()
        }
        res.status(201).json({ message: 'Load mood data successfully' })
    } catch {
        res.status(400).json({ message: 'Error' })
    }
})

module.exports = router