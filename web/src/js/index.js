const moodSlider = document.querySelector('.mood-slider-container input')
const pickOneButton = document.querySelector('.pick-one')
const pickPlaylistButton = document.querySelector('.pick-playlist')
const pickedList = document.querySelector('.picked-list')
const moodEmoji = document.querySelector('[data-mood-emoji]')
const moodText = document.querySelector('[data-mood-text]')
const sliderAnimate = document.querySelector('.slider-animate')

const moodEmojis = ['😞', '😰', '😍', '😌', '😊']
const moodTexts = ['Sad', 'Axious', 'Erotic', 'Relaxing', 'Joyful']

let moodValue = moodSlider.value
animateSlider(moodValue)

moodSlider.addEventListener('input', (e) => {
  moodValue = e.target.value
  mapMoodValueToDisplay(moodValue)
  animateSlider(moodValue)
})

pickOneButton.addEventListener('click', async () => {
  clearPickedList()
  pickedList.style.justifyContent = 'center'
  setLoading()
  const music = await fetchMusicByMoodLevel(moodValue, 'one')
  const songCard = createSongCard(music)
  pickedList.appendChild(songCard)
  loadingDone()
})

pickPlaylistButton.addEventListener('click', async () => {
  clearPickedList()
  pickedList.style.justifyContent = 'unset'
  setLoading()
  const musics = await fetchMusicByMoodLevel(moodValue, 'playlist')

  for (const music in musics) {
    const song = {
      pictures: musics[music].pictures,
      url: musics[music].url
    }

    const songCard = createSongCard(song)
    pickedList.appendChild(songCard)
  }
  loadingDone()
})

function clearPickedList() {
  pickedList.innerHTML = ''
}

function mapMoodValueToDisplay(value) {
  moodEmoji.innerText = moodEmojis[value]
  moodText.innerText = moodTexts[value]
}

async function fetchMusicByMoodLevel(value, type) {
  const path = `music${type === 'one' ? '' : 's'}`
  const { data } = await httpClient.get(`get-${path}/${value}`)
  return data
}

function animateSlider(value) {
  sliderAnimate.style.width = `${100 - (value / 4) * 100}%`
}

function createSongCard(song) {
  const songCard = document.createElement('a')
  songCard.classList.add('song-card')
  const songImage = document.createElement('img')
  songImage.src = song.pictures['768wx768h']

  songCard.href = song.url
  songCard.target = '_blank'
  songCard.appendChild(songImage)
  return songCard
}
