const moodSlider = document.querySelector('.mood-slider-container input')
const pickOneButton = document.querySelector('.pick-one')
const pickPlaylistButton = document.querySelector('.pick-playlist')
const pickedList = document.querySelector('.picked-list')

let moodValue = moodSlider.value

moodSlider.addEventListener('input', (e) => {
  moodValue = e.target.value
})

pickOneButton.addEventListener('click', () => {
  clearPickedList()
  pickedList.style.justifyContent = 'center'

  const songCard = document.createElement('div')
  songCard.classList.add('song-card')

  songCard.innerText = 'Song'
  pickedList.appendChild(songCard)
})

pickPlaylistButton.addEventListener('click', () => {
  clearPickedList()
  pickedList.style.justifyContent = 'unset'

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
