const router = require('express').Router()
const axios = require('axios')
const MoodData = require('../../models/MoodData')
const MoodTag = require('../../models/MoodTag')

const WEATHER_API_KEY = process.env.OPEN_WEATHER_KEY
const IP_STACK_KEY = process.env.IP_STACK_API
const API_KEY = process.env.API_KEY
const SPREAD_URL = `https://sheets.googleapis.com/v4/spreadsheets/19cTe7BX2O1z9NwgT8zNEkkwNvgAx26EiHZuaTU31VUU/values/A:Z?key=${API_KEY}`

const mood_scaling = ['Sad', 'Axious', 'Happy', 'Relaxing', 'Joyful']
let mood_point = 0

router.get('/users-music', async (req, res) => {
  const users_data = await MoodData.find({})
  res.status(200).json(users_data)
})

// run first
router.get('/mood-tag', async (req, res) => {
  const mood_tag_data = await MoodTag.find({})
  res.status(200).json(mood_tag_data)
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

  const music_genres = await MoodTag.find({
    moodName: `${mood_scaling[final_mood_point]}`
  })

  random_genre =
    music_genres[0].tags[
      Math.floor(Math.random() * music_genres[0].tags.length)
    ]
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

  const music_genres = await MoodTag.find({
    moodName: `${mood_scaling[final_mood_point]}`
  })
  const return_data = new Map()
  // Random algorithm
  for (var i = 0; i < 5; i++) {
    random_genre =
      music_genres[0].tags[
        Math.floor(Math.random() * music_genres[0].tags.length)
      ]
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
