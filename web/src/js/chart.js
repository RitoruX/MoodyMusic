google.charts.load('current', { packages: ['corechart', 'bar'] })
google.charts.setOnLoadCallback(drawPeopleMoodChart)
google.charts.setOnLoadCallback(drawPeopleMoodByGenreChart)

async function drawPeopleMoodChart() {
  const moodCount = await fetchMoodCount()
  const moodData = [['Mood', 'Number of people']]
  for (const moodKey in moodCount) {
    moodData.push([moodKey, moodCount[moodKey]])
  }
  var data = google.visualization.arrayToDataTable(moodData)

  var options = {
    title: "People's mood",
    is3D: true
  }

  var chart = new google.visualization.PieChart(
    document.getElementById('piechart_3d')
  )
  chart.draw(data, options)
}

async function drawPeopleMoodByGenreChart() {
  const genres = [
    'Chill-out music',
    'Smooth jazz',
    'Pop',
    'Dark pop',
    'Alternative Rock',
    'Sad pop',
    'Jazz',
    'Hip hop',
    'Opera',
    'Blue'
  ]
  const moodCountByGenre = await fetchMoodCountByGenre()
  const moodData = [['Mood', ...genres]]

  var data = google.visualization.arrayToDataTable([
    ...moodData,
    ['Relaxing', 2, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    ['Sad', 0, 0, 0, 1, 1, 3, 0, 0, 0, 0],
    ['Joyful', 0, 0, 2, 0, 0, 0, 1, 1, 0, 0],
    ['Happy', 0, 1, 2, 0, 0, 0, 0, 0, 1, 0],
    ['Axious', 0, 0, 1, 0, 0, 1, 0, 0, 0, 4]
  ])

  var options = {
    chart: {
      title: 'Prefer music genre by mood'
    }
  }

  var chart = new google.charts.Bar(
    document.getElementById('columnchart_material')
  )
  chart.draw(data, google.charts.Bar.convertOptions(options))
}

async function fetchMoodCount() {
  const { data } = await httpClient.get('users-mood')
  return data
}

async function fetchMoodCountByGenre() {
  const { data } = await httpClient.get('users-mood-genre')
  return data
}
