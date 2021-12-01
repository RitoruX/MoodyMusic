const router = require('express').Router()
const GenreData = require('./models/GenreData')
const axios = require('axios')

const API_KEY = process.env.API_KEY
const SHEET_ID = '19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU'
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:Z?key=${API_KEY}`

router.get('/load-users-music-data', async (req, res) => {
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
      const genre = new GenreData({
        genreName,
        musics: genreData[genreName]
      })
      await genre.save()
    }
    res.status(201).json({ message: 'Load genre data successfully' })
  } catch {
    res.status(400).json({ message: 'Error' })
  }
})

module.exports = router
