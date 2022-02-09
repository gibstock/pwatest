const startBtn = document.getElementById('start-watch')
const stopBtn = document.getElementById('stop-watch')
const longDisplay = document.getElementById('long')
const latDisplay = document.getElementById('lat')
const statusDisplay = document.getElementById('status')
let geoWatch;
let lonCoordCheck;
let latCoordCheck;
let port = window.location.port


window.addEventListener('DOMContentLoaded', () => {
  if(location.pathname.includes('poems')){
    console.log('you are in the poems directory')
    startWatchExtDir()
  }
  

})


if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
}

async function fetchCoords(url) {
  const res = await fetch(url)
  return await res.json();
}

function startWatch() {
  console.log('startWatch starting')
  if(!geoWatch) {
    if('geolocation' in navigator && 'watchPosition' in navigator.geolocation) {
      console.log('gps support')
      geoWatch = navigator.geolocation.watchPosition( setCurrentPosition, positionError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      })
      statusDisplay.innerText = 'Tracking'
    } 

  }
}
function startWatchExtDir() {
  console.log('startWatch starting')
  if(!geoWatch) {
    if('geolocation' in navigator && 'watchPosition' in navigator.geolocation) {
      console.log('gps support')
      geoWatch = navigator.geolocation.watchPosition( setCurrentPositionExtDir, positionError, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      })
      statusDisplay.innerText = 'Tracking'
    } 

  }
}

function setCurrentPosition( position ) {
  fetchCoords("js/config.json").then(data => {
    let latA00 = data.coords[0].latA
    let latB00 = data.coords[0].latB
    let lonA00 = data.coords[0].lonA
    let lonB00 = data.coords[0].lonB
    let latA01 = data.coords[1].latA
    let latB01 = data.coords[1].latB
    let lonA01 = data.coords[1].lonA
    let lonB01 = data.coords[1].lonB
    
    console.log(latCoordCheck, "stage one")
    longDisplay.innerHTML = position.coords.longitude
    latDisplay.innerHTML = position.coords.latitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude
    
    if(latCoordCheck >= latA00 && latCoordCheck <= latB00 && lonCoordCheck >= lonA00 && lonCoordCheck <= lonB00) {
      if(location != `http://localhost:${port}/poems/poem2.html` ) {
        // location.assign opens new page in the same tab and we lose gps control.
        location.assign(`http://localhost:${port}/poems/poem2.html`)
        // window.open keeps opening up tabs as the location function keeps running.
        // window.open(`http://localhost:${port}/poems/poem2.html`)
        console.log('You are at Poem #2')
      }
    }
  
    if(latCoordCheck >= latA01 && latCoordCheck <= latB01 && lonCoordCheck >= lonA01 && lonCoordCheck <= lonB01) {
      if(location != `http://localhost:${port}/poems/poem1.html` )
      location.assign(`http://localhost:${port}/poems/poem1.html`)
      // window.open(`http://localhost:${port}/poems/poem2.html`)
      console.log('You are at Poem #1')
    }
  })
}

// Need to create a function when the route is changed
function setCurrentPositionExtDir( position ) {
  fetchCoords("../js/config.json").then(data => {
    let latA00 = data.coords[0].latA
    let latB00 = data.coords[0].latB
    let lonA00 = data.coords[0].lonA
    let lonB00 = data.coords[0].lonB
    let latA01 = data.coords[1].latA
    let latB01 = data.coords[1].latB
    let lonA01 = data.coords[1].lonA
    let lonB01 = data.coords[1].lonB
    
    console.log(latCoordCheck, "stage one")
    longDisplay.innerHTML = position.coords.longitude
    latDisplay.innerHTML = position.coords.latitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude
    
    if(latCoordCheck >= latA00 && latCoordCheck <= latB00 && lonCoordCheck >= lonA00 && lonCoordCheck <= lonB00) {
      if(location != `http://localhost:${port}/poems/poem2.html` ) {
        // location.assign opens new page in the same tab and we lose gps control.
        location.assign(`http://localhost:${port}/poems/poem2.html`)
        // window.open keeps opening up tabs as the location function keeps running.
        // window.open(`http://localhost:${port}/poems/poem2.html`)
        console.log('You are at Poem #2')
      }
    }
  
    if(latCoordCheck >= latA01 && latCoordCheck <= latB01 && lonCoordCheck >= lonA01 && lonCoordCheck <= lonB01) {
      if(location != `http://localhost:${port}/poems/poem1.html` )
      location.assign(`http://localhost:${port}/poems/poem1.html`)
      // window.open(`http://localhost:${port}/poems/poem2.html`)
      console.log('You are at Poem #1')
    }
  })
}

function positionError( error ) {
  switch (error.code) {
    case error.PERMISSION_DENIED:

      console.error("User denied the request for Geolocation")
      break;

    case error.POSITION_UNAVAILABLE:

      console.error("Location information is unavailable")
      break;

    case error.TIMEOUT:

      console.error("The request has timed out")
      break;

    case error.UNKOWN_ERROR:

      console.error("An unkown error occured")
      break;
  }
}

function stopWatch() {
  navigator.geolocation.clearWatch( geoWatch)
  geoWatch = undefined;
  longDisplay.innerHTML = 'Null'
  latDisplay.innerHTML = 'Null'
  statusDisplay.innerHTML = 'Off'
  console.log('tracking stopped')
}

// async function fetchCoords() {
//   const response = await fetch('js/config.json')
//   const coords = response.json()
//   return coords
// }


stopBtn.addEventListener('click', stopWatch)
startBtn.addEventListener('click', startWatch)