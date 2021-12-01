const moodSlider = document.querySelector('.mood-slider-container input')
const pickOneButton = document.querySelector('.pick-one')
const pickPlaylistButton = document.querySelector('.pick-playlist')
const pickedList = document.querySelector('.picked-list')
const moodEmoji = document.querySelector('[data-mood-emoji]')
const moodText = document.querySelector('[data-mood-text]')

const moodEmojis = ['😞', '😰', '😍', '😌', '😊']
const moodTexts = ['Sad', 'Axious', 'Erotic', 'Relaxing', 'Joyful']

let moodValue = moodSlider.value

moodSlider.addEventListener('input', (e) => {
  moodValue = e.target.value
  mapMoodValueToDisplay(moodValue)
})

pickOneButton.addEventListener('click', async () => {
  clearPickedList()
  pickedList.style.justifyContent = 'center'

  await fetchMusicByMoodLevel(moodValue)

  const songCard = document.createElement('div')
  songCard.classList.add('song-card')

  songCard.innerText = 'Song'
  pickedList.appendChild(songCard)
})

pickPlaylistButton.addEventListener('click', async () => {
  clearPickedList()
  pickedList.style.justifyContent = 'unset'

  await fetchMusicByMoodLevel(moodValue)

  for (let i = 0; i < 10; i++) {
    const songCard = document.createElement('div')
    songCard.classList.add('song-card')
    songCard.innerText = 'Song'

    pickedList.appendChild(songCard)
  }
})

function clearPickedList() {
  pickedList.innerHTML = ''
}

function mapMoodValueToDisplay(value) {
  moodEmoji.innerText = moodEmojis[value]
  moodText.innerText = moodTexts[value]
}

async function fetchMusicByMoodLevel(moodLevel) {
  const { data } = httpClient.get(`get-music/${moodLevel}`)
  console.log(data)
}
