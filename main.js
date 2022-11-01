const IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/'
const NAME_URL = 'https://pokeapi.co/api/v2/pokemon-species/'
const container = document.querySelector('.container')
const playArea = document.querySelector('.play-area')
const checkButton = document.querySelector('#check')
const pokemonImage = document.querySelector('#pokemon-image')
const progressBar = document.querySelectorAll('.progress-bar li')
const audio = document.querySelectorAll('audio')
const GAME_STATE = {
  id: randomId(),
  count: 0,
  correctAnswer: false,
}

function getImageData() {
  axios.get(`${IMAGE_URL}${GAME_STATE.id}.svg`)
    .then(response => {
      pokemonImage.innerHTML = response.data
      if (GAME_STATE.correctAnswer === false) {
        checkImageStyle()
        audio[0].play()
      } else {
        setTimeout(checkWinGame, 1000)
      }
    })
    .catch(error => console.log(error))
}

function randomId() {
  return Math.floor(Math.random() * 150) + 1
}

function checkImageStyle() {
  const path = document.querySelectorAll('svg g path')
  path.forEach(color => color.setAttribute('fill', ''))
}

function checkPokemon() {
  const answer = document.querySelector('#answer')
  
  axios.get(`${NAME_URL}${GAME_STATE.id}`)
    .then(response => {
      const name = response.data.names[3].name
      console.log(name)
      if (name === answer.value) {
        audio[1].play()
        GAME_STATE.correctAnswer = true
        GAME_STATE.count++
        playArea.classList.add('correct')
        setTimeout(`removeEffect('correct')`, 1000)
        getImageData()
        checkProgressBar()
        answer.value = ""
      } else {
        audio[2].play()
        playArea.classList.add('wrong')
        setTimeout(`removeEffect('wrong')`, 1000)
      }
    })
    .catch(error => console.log(error))
}

function removeEffect(className) {
  playArea.classList.remove(className)
}

function checkProgressBar() {
  progressBar.forEach(progress => {
    if (Number(progress.textContent) === GAME_STATE.count) {
      const pokeBall = 'resource/poke-ball.jpg'
      progress.style.backgroundImage = `url(${pokeBall})`
      progress.style.backgroundRepeat = 'no-repeat'
      progress.style.backgroundSize = 'cover'
      progress.textContent = ''
    }
  })
}

function checkWinGame() {
  if (GAME_STATE.count === 5) {
    showWinMessage()
  } else {
    GAME_STATE.id = randomId()
    GAME_STATE.correctAnswer = false
    getImageData()
  }
}

function showWinMessage() {
  audio[3].play()
  const div = document.createElement('div')
  div.className = 'complete'
  div.innerHTML = `
    <button type="reset" class="reset">再玩一次?</button>
  `
  container.appendChild(div)

  const button = document.querySelector('.reset')
  button.addEventListener('click', resetGame)
}

function resetGame() {
  window.location.reload()
}

checkButton.addEventListener('click', checkPokemon)
getImageData()