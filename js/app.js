const startBtn = document.getElementById('start-watch')
const stopBtn = document.getElementById('stop-watch')
const longDisplay = document.getElementById('long')
const latDisplay = document.getElementById('lat')
let geoWatch;

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
}


function startWatch() {
  console.log('startWatch starting')
  if(!geoWatch) {
    if('geolocation' in navigator && 'watchPosition' in navigator.geolocation) {
      console.log('gps support')
      geoWatch = navigator.geolocation.watchPosition( setCurrentPosition, positionError, {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 0
      })
    } 

  }
}

function setCurrentPosition( position ) {
  longDisplay.innerHTML = position.coords.longitude
  latDisplay.innerHTML = position.coords.latitude
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
  console.log('tracking stopped')
}

stopBtn.addEventListener('click', stopWatch)
startBtn.addEventListener('click', startWatch)