const startBtn = document.getElementById('start-watch')
const stopBtn = document.getElementById('stop-watch')

const longDisplay = document.getElementById('long')
const latDisplay = document.getElementById('lat')
const statusDisplay = document.getElementById('status')

// position tracking
let geoWatch;
let lonCoordCheck;
let latCoordCheck;

// if port is needed
let port = window.location.port

// identifying poem location
let poem;
let identifier;

// Log the currently launched external url
const openTab = []
const poemsUrl = "https://sites.google.com/view/soundriver/home/the-poems/"
const AUTH = "?authuser=0"

// ------> Old function for checking route location <----- //
// window.addEventListener('DOMContentLoaded', () => {
//   if(location.pathname.includes('routes')){
//     console.log('you are in the routes directory')
//     startWatchExtDir()
//   }
// })

// register service worker for caching assets
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
}

// async fetch coordinates function
async function fetchCoords(url) {
  const res = await fetch(url)
  return await res.json();
}

// begin listening for coordinates and track changes
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

// Close previously opened tabs
function closeTab() {
  openTab[0].close()
  console.log("tabs closed")
}

// begin to fetch coordinates and set the geolocation
function setCurrentPosition( position ) {
  // console.log("starting fetch")
  fetchCoords("/js/config.json").then(data => {
    console.log('fetching')

    // there may be a more dynamic way to set the data as we scale up
    let latA00 = data.coords[0].latA
    let latB00 = data.coords[0].latB
    let lonA00 = data.coords[0].lonA
    let lonB00 = data.coords[0].lonB
    let name00 = data.coords[0].name
    let min00 = data.coords[0].time.min
    let sec00 = data.coords[0].time.sec
    let latA01 = data.coords[1].latA
    let latB01 = data.coords[1].latB
    let lonA01 = data.coords[1].lonA
    let lonB01 = data.coords[1].lonB
    let name01 = data.coords[1].name
    let min01 = data.coords[1].time.min
    let sec01 = data.coords[1].time.sec

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    longDisplay.innerHTML = position.coords.longitude
    latDisplay.innerHTML = position.coords.latitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    console.log(latCoordCheck >= latA00 , latCoordCheck <= latB00 ,lonCoordCheck >= lonA00 ,lonCoordCheck <= lonB00)

    // if the coordinate bounding box is entered
    if(latCoordCheck >= latA00 && latCoordCheck <= latB00 && lonCoordCheck >= lonA00 && lonCoordCheck <= lonB00) {
      poem = "poem-1"
      let timer = (((min00*60) + sec00) * 1000)
      
      // if the window has not previously been opened
      if(openTab[0] !== `${poemsUrl}${poem}${AUTH}` && openTab !== `${poemsUrl}${poem}${AUTH}` && identifier !== name00) {
        // launch the new window with the poems page
        openTab.push(window.open(`${poemsUrl}${poem}${AUTH}`, '_blank'))
        identifier = name00
        console.log("old tab open", openTab[1])
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
    }

    // there will be the same code block for each location
    // maybe these can be modularized
    console.log(latCoordCheck >= latA01 , latCoordCheck <= latB01 ,lonCoordCheck >= lonA01 ,lonCoordCheck <= lonB01)
    if(latCoordCheck >= latA01 && latCoordCheck <= latB01 && lonCoordCheck >= lonA01 && lonCoordCheck <= lonB01) {
      poem = "poem-2"
      let timer = (((min01*60) + sec01) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${poemsUrl}${poem}${AUTH}` && openTab !== `${poemsUrl}${poem}${AUTH}` && identifier !== name01) {
        openTab.push(window.open(`${poemsUrl}${poem}${AUTH}`, '_blank'))
        identifier = name01
        if(openTab[1]) {
          closeTab()
        }
      }
      setTimeout(() => {
        for(let i = 0; i<openTab.length; i++) {
          openTab[i].close()
        }
      }, timer)
    }
  })
}

// error handling
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

// function to stop the active tracking
function stopWatch() {
  navigator.geolocation.clearWatch( geoWatch)
  geoWatch = undefined;
  longDisplay.innerHTML = 'Null'
  latDisplay.innerHTML = 'Null'
  statusDisplay.innerHTML = 'Off'
  console.log('tracking stopped')
}

stopBtn.addEventListener('click', stopWatch)
startBtn.addEventListener('click', startWatch)