const router = require('express').Router()
const axios = require('axios')
const GenreData = require('../../models/GenreData')

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY
const IP_STACK_KEY = process.env.IP_STACK_API
const API_KEY = process.env.API_KEY
const SPREAD_URL = `https://sheets.googleapis.com/v4/spreadsheets/19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU/values/A:Z?key=${API_KEY}`
const MONGODB_URL = process.env.MONGODB_URL

const mood_scaling = ['Sad', 'Axious', 'Happy', 'Relaxing', 'Joyful']
let mood_point = 0
var moody_music = new Map()

router.get('/user-music', async (req, res) => {
  const response = await axios.get(SPREAD_URL)
  const spreadsheet_data = response.data.values
  const users_music = {}
  for (const item of spreadsheet_data.slice(1)) {
    const mood = item[5]
    const music = item[6]
    if (mood in users_music) {
      users_music[mood] = [...users_music[mood], music]
    } else {
      users_music[mood] = [music]
    }
  }
  res.status(200).json(users_music)
})

// run first
router.get('/mood-music', async (req, res) => {
  const spread_response = await axios.get(SPREAD_URL)
  const spreadsheet_data = spread_response.data.values
  for (const item of spreadsheet_data.slice(1)) {
    var music_request = await axios.get(
      encodeURI(`https://api.mixcloud.com/search/?q=${item[7]}&type=cloudcast`)
    )
    var music_info = music_request.data
    if (music_info.data.length > 0) {
      for (const info of music_info.data) {
        if (info.tags.length < 0) {
          moody_music.set(item[6], new Array())
        }
        for (const tag of info.tags) {
          // console.log(tag.name);
          if (moody_music.has(item[6])) {
            moody_music.get(item[6]).push(tag.name)
          } else {
            moody_music.set(item[6], new Array(tag.name))
          }
        }
      }
    }
  }
  res.status(200).json(Object.fromEntries(moody_music))
})

router.get('/get-music/:point', async (req, res) => {
  const ip_location = await axios.get(
    `http://api.ipstack.com/check?access_key=${IP_STACK_KEY}`
  )
  const weather_response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?zip=${ip_location.data.zip},${ip_location.data.country_code}&appid=${WEATHER_API_KEY}`
  )
  const temp = weather_response.data.main.temp - 273
  if (temp < 28) {
    mood_point = -2
  } else if (28 <= temp < 30) {
    mood_point = -1
  } else if (30 <= temp < 32) {
    mood_point = 0
  } else if (32 <= temp < 34) {
    mood_point = 1
  } else if (temp >= 34) {
    mood_point = 2
  }
  var final_mood_point = parseInt(req.params.point) + parseInt(mood_point)
  if (final_mood_point < 0) {
    final_mood_point = 0
  } else if (final_mood_point > 4) {
    final_mood_point = 4
  }
  if (moody_music.size == 0) {
    moody_music = await axios
      .get(`http://localhost:3000/api/v1/mood-music`)
      .then((result) => result.data)
  }
  const music_genres = moody_music[`${mood_scaling[final_mood_point]}`]
  random_genre = music_genres[Math.floor(Math.random() * music_genres.length)]
  const music_response = await axios
    .get(`https://api.mixcloud.com/search/?q=${random_genre}&type=cloudcast`)
    .then((result) => result.data)
  random_music =
    music_response.data[Math.floor(Math.random() * music_response.data.length)]
  const return_data = new Map([
    ['name', `${random_music.name}`],
    ['url', `${random_music.url}`],
    ['pictures', random_music.pictures]
  ])
  res.status(200).json(Object.fromEntries(return_data))
})

router.get('/get-musics/:point', async (req, res) => {
  const ip_location = await axios.get(
    `http://api.ipstack.com/check?access_key=${IP_STACK_KEY}`
  )
  const weather_response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?zip=${ip_location.data.zip},${ip_location.data.country_code}&appid=${WEATHER_API_KEY}`
  )
  const temp = weather_response.data.main.temp - 273
  if (temp < 28) {
    mood_point = -2
  } else if (28 <= temp < 30) {
    mood_point = -1
  } else if (30 <= temp < 32) {
    mood_point = 0
  } else if (32 <= temp < 34) {
    mood_point = 1
  } else if (temp >= 34) {
    mood_point = 2
  }
  var final_mood_point = parseInt(req.params.point) + parseInt(mood_point)
  if (final_mood_point < 0) {
    final_mood_point = 0
  } else if (final_mood_point > 4) {
    final_mood_point = 4
  }
  // console.log(final_mood_point)
  if (moody_music.size == 0) {
    moody_music = await axios
      .get(`http://localhost:3000/api/v1/mood-music`)
      .then((result) => result.data)
  }
  const music_genres = moody_music[`${mood_scaling[final_mood_point]}`]
  const return_data = new Map()
  // Random algorithm
  for (var i = 0; i < 5; i++) {
    random_genre = music_genres[Math.floor(Math.random() * music_genres.length)]
    const music_response = await axios
      .get(`https://api.mixcloud.com/search/?q=${random_genre}&type=cloudcast`)
      .then((result) => result.data)
    random_music =
      music_response.data[
        Math.floor(Math.random() * music_response.data.length)
      ]
    temp_data = {}
    temp_data['url'] = `${random_music.url}`
    temp_data['pictures'] = random_music.pictures
    return_data.set(random_music.name, temp_data)
  }
  res.status(200).json(Object.fromEntries(return_data))
})

module.exports = router
