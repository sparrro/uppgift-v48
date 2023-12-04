const BASE_URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com'

const planetEls = [...document.querySelectorAll('main>*')]
const headerEl = document.querySelector('header')
const backgroundStarsEl = document.getElementById('background-stars')

let canClick = true

async function getKey() {
    let key = await fetch(`${BASE_URL}/keys`, {
        method: 'POST'
    })
    key = await key.json()
    return key.key
}

async function getPlanets() {
    let planets = await fetch(`${BASE_URL}/bodies`, {
        method: 'GET',
        headers: {'x-zocom': await getKey()}
    })
    planets = await planets.json()
    return planets.bodies
}

const planets = await getPlanets()
console.log(planets)

//strör ut bakgrundsstjärnor
for (let i = 0; i<100; i++) {
    let star = document.createElement('div')
    star.classList.add('background-star')
    star.style.top = `${Math.floor(Math.random()*100)}%`
    star.style.left = `${Math.floor(Math.random()*100)}%`
    backgroundStarsEl.appendChild(star)
}

planetEls.forEach(planetEl => {
    planetEl.addEventListener('click', () => {
        clickPlanet(planetEl)
    })
})

function clickPlanet(planet) {
    if (canClick) {
        zoomIn(planet)
        let planetObj = planets[planetEls.indexOf(planet)]
        canClick = false
    } else {
        zoomOut(planet)
        canClick = true
    }
}

function zoomIn(planet) {
    planet.style.height = '79.875rem'
    planet.style.left = '-70rem'
    planet.classList.add('clicked') //sätter box-shadow med transition
    planetEls.forEach(planetEl => {
        if (planetEl != planet) {
            planetEl.style.opacity = '0'
        }
    })
    headerEl.style.opacity = '0'
    if (planet.id != 'sun') {
        let starEls = [...backgroundStarsEl.children]
        starEls.forEach(starEl => {
            starEl.style.opacity = '0.9'
        })
    }
}

function zoomOut(planet) {
    planet.style = null
    planet.classList.remove('clicked')
    planetEls.forEach(planetEl => {
        planetEl.style.opacity = '1'
    })
    headerEl.style.opacity = '1'
    let starEls = [...backgroundStarsEl.children]
    starEls.forEach(starEl => {
        starEl.style.opacity = '0'
    })
}
