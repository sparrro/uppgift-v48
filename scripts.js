const BASE_URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com'

const planetEls = [...document.querySelectorAll('main>*')]
const headerEl = document.querySelector('header')
const backgroundStarsEl = document.getElementById('background-stars')
const overlayEl = document.getElementById('overlay')

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

//strör ut bakgrundsstjärnor
for (let i = 0; i<100; i++) {
    let star = document.createElement('div')
    star.classList.add('background-star')
    star.style.top = `${Math.floor(Math.random()*100)}.${Math.floor(Math.random()*99)}%`
    star.style.left = `${Math.floor(Math.random()*100)}.${Math.floor(Math.random()*99)}%`
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
        setTimeout(() => {
            openOverlay(planet)
        }, 2000)
        canClick = false
    } else {
        zoomOut(planet)
        overlayEl.innerHTML = ''
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
            planetEl.style.cursor = 'unset'
            planetEl.title = ''
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
        planetEl.style.cursor = 'pointer'
        planetEl.title = planets[planetEls.indexOf(planetEl)].name
    })
    headerEl.style.opacity = '1'
    let starEls = [...backgroundStarsEl.children]
    starEls.forEach(starEl => {
        starEl.style.opacity = '0'
    })
}

function openOverlay(planet) {
    let planetObj = planets[planetEls.indexOf(planet)]
    overlayEl.innerHTML = `
        <h2 class="swedish">${planetObj.name.toUpperCase()}</h2>
        <h3 class="latin">${planetObj.latinName.toUpperCase()}</h3>
        <p>${planetObj.desc}</p>
        <hr>
        <h3>OMKRETS</h3>
        <h3>KM FRÅN SOLEN</h3>
        <p>${spaceOutNumber(planetObj.circumference)}km</p>
        <p>${spaceOutNumber(planetObj.distance)}km</p>
        <h3>MAX TEMPERATUR</h3>
        <h3>MIN TEMPERATUR</h3>
        <p>${planetObj.temp.day}C</p>
        <p>${planetObj.temp.night}C</p>
        <hr>
        <h3>MÅNAR</h3>
        <p>${planetObj.moons.length>0 ? planetObj.moons.join(', ') : 'Inga'}</p>
    `
}

function spaceOutNumber(num) {
    num = [...num.toString()]
    for (let i = num.length; i>0; i-=3) {
        num.splice(i, 0, ' ')
    }
    return num.join('')
}
