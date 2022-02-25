const startBtn = document.getElementById('start-watch')
const stopBtn = document.getElementById('stop-watch')

const longDisplay = document.getElementById('long')
const latDisplay = document.getElementById('lat')
const statusDisplay = document.getElementById('status')
const sheets = document.getElementById('sheets')

//Constants for establishing an equal perimeter
const LAT_RADIUS = 0.0011
const LON_RADIUS = 0.00050

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

// Deprecated constants
// const poemsUrl = "https://sites.google.com/view/soundriver/home/the-poems/"
// const AUTH = "?authuser=0"

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

//-----> Not fetching from config.json <----//
// async fetch coordinates function
// async function fetchCoords(url) {
//   const res = await fetch(url)
//   return await res.json();
// }

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
  //<----- OLD FETCH ----->
  // console.log("starting fetch")
  // fetchCoords("/js/config.json").then(data => {
  //   console.log('fetching')

  // Test google sheet
  // const fetchedGoogleSheetData = fetch('https://docs.google.com/spreadsheets/d/1XCWJEx9MjOzYh9tXFQhFHdu8bdl40ty5GPrfk6p9cYE/gviz/tq?tqx=out:json')
  
  
  // Fetch coords from google sheet
  const fetchedGoogleSheetData = fetch('https://docs.google.com/spreadsheets/d/1AQMb2Whd0s7h0ceczLrJzPai5zNXgZBHl1qR5pO3Aog/gviz/tq?tqx=out:json')
    .then(response => response.text())
    .then(data => {

      // Need to find the start of the json info becuase sheets updates the sig parameter
      let colStart = data.indexOf("cols") -2

      // Get only the part of the google sheet response that is in json format, parse as json
      const result = (JSON.parse(data.slice(colStart, data.length - 3))).rows

    // -- there may be a more dynamic way to set the data as we scale up
    let lat1 = result[0].c[0].v
    let lon1 = result[0].c[1].v
    let url1 = result[0].c[2].v
    let min1 = result[0].c[5].v
    let sec1 = result[0].c[6].v
    let name1 = result[0].c[7].v
    let lat2 = result[1].c[0].v
    let lon2 = result[1].c[1].v
    let url2 = result[1].c[2].v
    let min2 = result[1].c[5].v
    let sec2 = result[1].c[6].v
    let name2 = result[1].c[7].v
    

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    console.log("poem 1", latCoordCheck >= (lat1 - LAT_RADIUS) , latCoordCheck <= (lat1 + LAT_RADIUS) ,lonCoordCheck >= (lon1 - LON_RADIUS) ,lonCoordCheck <= (lon1 + LON_RADIUS))

    // if the coordinate bounding box is entered
    if(latCoordCheck >= (lat1 - LAT_RADIUS) && latCoordCheck <= (lat1 + LAT_RADIUS) && lonCoordCheck >= (lon1 - LON_RADIUS) && lonCoordCheck <= (lon1 + LON_RADIUS)) {
      console.log(url1)
      poem = name1
      let timer = (((min1*60) + sec1) * 1000)
      console.log(typeof timer)
      console.log("timer", timer)
      console.log("open tab before launch", openTab)
      // if the window has not previously been opened
      if(openTab[0] !== `${url1}` && openTab !== `${url1}` && identifier !== name1) {

        // launch the new window with the poems page and push the location of the open tab to openTab
        openTab.push(window.open(`${url1}`, '_blank'))

        // Set identifier to current poem
        identifier = name1
        
        // If a tab already exists, close it
        if(openTab[1]) {
          closeTab()
        }

        // Auto close the tab after the length of the current poem has passed
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
    sheets.innerText = poem

    }

    // there will be the same code block for each location
    // maybe these can be modularized
    // console.log("poem 2", latCoordCheck >= (lat2 - LAT_RADIUS) , latCoordCheck <= (lat2 + LAT_RADIUS) ,lonCoordCheck >= (lon2 - LON_RADIUS) ,lonCoordCheck <= (lon2 + LON_RADIUS))
    if(latCoordCheck >= (lat2 - LAT_RADIUS) && latCoordCheck <= (lat2 + LAT_RADIUS) && lonCoordCheck >= (lon2 - LON_RADIUS) && lonCoordCheck <= (lon2 + LON_RADIUS)) {
      poem = name2
      let timer = (((min2*60) + sec2) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url2}` && openTab !== `${url2}` && identifier !== name2) {
        openTab.push(window.open(`${url2}`, '_blank'))
        identifier = name2
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      // Output the name of the current poem
      sheets.innerText = poem

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

// stopBtn.addEventListener('click', stopWatch)
// startBtn.addEventListener('click', startWatch)