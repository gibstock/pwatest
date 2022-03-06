const longDisplay = document.getElementById('longDisplay')
const latDisplay = document.getElementById('latDisplay')
const statusDisplay = document.getElementById('tracking')
const trackingBox = document.getElementById('tracking-message-box')
const sheets = document.getElementById('sheets')

const toggle = document.getElementById('tracking-toggle')
const onIndicator = document.getElementById('on')
const offIndicator = document.getElementById('off')

const MASTER_URL = 'https://docs.google.com/spreadsheets/d/1AQMb2Whd0s7h0ceczLrJzPai5zNXgZBHl1qR5pO3Aog/gviz/tq?tqx=out:json'
const TESTING_URL = 'https://docs.google.com/spreadsheets/d/1UXk1YdG3AOJQ2YkSMxBG5PWebQGkO_TXq5Ni7s6ffws/gviz/tq?tqx=out:json'

//Constants for establishing an equal perimeter. Can be adjusted to fit the bounding area
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

// register service worker for caching assets
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then((reg) => console.log('service worker registered', reg))
  .catch((err) => console.log('service worker not registered', err))
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
    
  // Fetch coords from google sheet
  const fetchedGoogleSheetData = fetch(TESTING_URL)
    .then(response => response.text())
    .then(data => {

      // Need to find the start of the json info becuase sheets updates the sig parameter
      let colStart = data.indexOf("cols") -2

      // Get only the part of the google sheet response that is in json format, parse as json
      const result = (JSON.parse(data.slice(colStart, data.length - 3))).rows

    // -- there may be a more dynamic way to set the variables as we scale up
    // -- Add functionality that assigns variables to each group of variable types

    // Poem 1
    let lat1 = result[0].c[0].v
    let lon1 = result[0].c[1].v
    let url1 = result[0].c[2].v
    let youtubeUrl1 = result[0].c[3]
    let min1 = result[0].c[5].v
    let sec1 = result[0].c[6].v
    let name1 = result[0].c[7].v

    // Poem 2
    let lat2 = result[1].c[0].v
    let lon2 = result[1].c[1].v
    let url2 = result[1].c[2].v
    let youtubeUrl2 = result[1].c[3]
    let min2 = result[1].c[5].v
    let sec2 = result[1].c[6].v
    let name2 = result[1].c[7].v
    
    // Poem 3
    let lat3 = result[2].c[0].v
    let lon3 = result[2].c[1].v
    let url3 = result[2].c[2].v
    let youtubeUrl3 = result[2].c[3]
    let min3 = result[2].c[5].v
    let sec3 = result[2].c[6].v
    let name3 = result[2].c[7].v
    
    // Poem 4
    let lat4 = result[3].c[0].v
    let lon4 = result[3].c[1].v
    let url4 = result[3].c[2].v
    let youtubeUrl4 = result[3].c[3]
    let min4 = result[3].c[5].v
    let sec4 = result[3].c[6].v
    let name4 = result[3].c[7].v
    
    // Poem 5
    let lat5 = result[4].c[0].v
    let lon5 = result[4].c[1].v
    let url5 = result[4].c[2].v
    let youtubeUrl5 = result[4].c[3]
    let min5 = result[4].c[5].v
    let sec5 = result[4].c[6].v
    let name5 = result[4].c[7].v
    
    // Poem 6
    let lat6 = result[5].c[0].v
    let lon6 = result[5].c[1].v
    let url6 = result[5].c[2].v
    let youtubeUrl6 = result[5].c[3]
    let min6 = result[5].c[5].v
    let sec6 = result[5].c[6].v
    let name6 = result[5].c[7].v
    
    // Poem 7
    let lat7 = result[6].c[0].v
    let lon7 = result[6].c[1].v
    let url7 = result[6].c[2].v
    let youtubeUrl7 = result[6].c[3]
    let min7 = result[6].c[5].v
    let sec7 = result[6].c[6].v
    let name7 = result[6].c[7].v
    console.log(name7)
    
    // Poem 8
    let lat8 = result[7].c[0].v
    let lon8 = result[7].c[1].v
    let url8 = result[7].c[2].v
    let youtubeUrl8 = result[7].c[3]
    let min8 = result[7].c[5].v
    let sec8 = result[7].c[6].v
    let name8 = result[7].c[7].v
    
    // Poem 9
    let lat9 = result[8].c[0].v
    let lon9 = result[8].c[1].v
    let url9 = result[8].c[2].v
    let youtubeUrl9 = result[8].c[3]
    let min9 = result[8].c[5].v
    let sec9 = result[8].c[6].v
    let name9 = result[8].c[7].v
    
    // Poem 10
    let lat10 = result[9].c[0].v
    let lon10 = result[9].c[1].v
    let url10 = result[9].c[2].v
    let youtubeUrl10 = result[9].c[3]
    let min10 = result[9].c[5].v
    let sec10 = result[9].c[6].v
    let name10 = result[9].c[7].v
    

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    console.log("poem 1", latCoordCheck >= (lat1 - LAT_RADIUS) , latCoordCheck <= (lat1 + LAT_RADIUS) ,lonCoordCheck >= (lon1 - LON_RADIUS) ,lonCoordCheck <= (lon1 + LON_RADIUS))

    // Conditionally checking and functionality of launching external sites

    // if the coordinate bounding box is entered
    // POEM 1 ////////
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
    sheets.innerText = poem // Output the name of the current poem

    }

    // there will be the same code block for each location
    // maybe these can be modularized
    // console.log("poem 2", latCoordCheck >= (lat2 - LAT_RADIUS) , latCoordCheck <= (lat2 + LAT_RADIUS) ,lonCoordCheck >= (lon2 - LON_RADIUS) ,lonCoordCheck <= (lon2 + LON_RADIUS))
    // POEM 2 ///////
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
      sheets.innerText = poem

    }

    // POEM 3 ////////
    if(latCoordCheck >= (lat3 - LAT_RADIUS) && latCoordCheck <= (lat3 + LAT_RADIUS) && lonCoordCheck >= (lon3 - LON_RADIUS) && lonCoordCheck <= (lon3 + LON_RADIUS)) {
      poem = name3
      let timer = (((min3*60) + sec3) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url3}` && openTab !== `${url3}` && identifier !== name3) {
        openTab.push(window.open(`${url3}`, '_blank'))
        identifier = name3
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 4 //////
    if(latCoordCheck >= (lat4 - LAT_RADIUS) && latCoordCheck <= (lat4 + LAT_RADIUS) && lonCoordCheck >= (lon4 - LON_RADIUS) && lonCoordCheck <= (lon4 + LON_RADIUS)) {
      poem = name4
      let timer = (((min4*60) + sec4) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url4}` && openTab !== `${url4}` && identifier !== name4) {
        openTab.push(window.open(`${url4}`, '_blank'))
        identifier = name4
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 5 //////
    if(latCoordCheck >= (lat5 - LAT_RADIUS) && latCoordCheck <= (lat5 + LAT_RADIUS) && lonCoordCheck >= (lon5 - LON_RADIUS) && lonCoordCheck <= (lon5 + LON_RADIUS)) {
      poem = name5
      let timer = (((min5*60) + sec5) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url5}` && openTab !== `${url5}` && identifier !== name5) {
        openTab.push(window.open(`${url5}`, '_blank'))
        identifier = name5
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 6 //////
    if(latCoordCheck >= (lat6 - LAT_RADIUS) && latCoordCheck <= (lat6 + LAT_RADIUS) && lonCoordCheck >= (lon6 - LON_RADIUS) && lonCoordCheck <= (lon6 + LON_RADIUS)) {
      poem = name6
      let timer = (((min6*60) + sec6) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url6}` && openTab !== `${url6}` && identifier !== name6) {
        openTab.push(window.open(`${url6}`, '_blank'))
        identifier = name6
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 7 //////
    if(latCoordCheck >= (lat7 - LAT_RADIUS) && latCoordCheck <= (lat7 + LAT_RADIUS) && lonCoordCheck >= (lon7 - LON_RADIUS) && lonCoordCheck <= (lon7 + LON_RADIUS)) {
      poem = name7
      let timer = (((min7*60) + sec7) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url7}` && openTab !== `${url7}` && identifier !== name7) {
        openTab.push(window.open(`${url7}`, '_blank'))
        identifier = name7
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 8 //////
    if(latCoordCheck >= (lat8 - LAT_RADIUS) && latCoordCheck <= (lat8 + LAT_RADIUS) && lonCoordCheck >= (lon8 - LON_RADIUS) && lonCoordCheck <= (lon8 + LON_RADIUS)) {
      poem = name8
      let timer = (((min8*60) + sec8) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url8}` && openTab !== `${url8}` && identifier !== name8) {
        openTab.push(window.open(`${url8}`, '_blank'))
        identifier = name8
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 9 //////
    if(latCoordCheck >= (lat9 - LAT_RADIUS) && latCoordCheck <= (lat9 + LAT_RADIUS) && lonCoordCheck >= (lon9 - LON_RADIUS) && lonCoordCheck <= (lon9 + LON_RADIUS)) {
      poem = name9
      let timer = (((min9*60) + sec9) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url9}` && openTab !== `${url9}` && identifier !== name9) {
        openTab.push(window.open(`${url9}`, '_blank'))
        identifier = name9
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
      sheets.innerText = poem

    }

    // POEM 10 //////
    console.log("poem 10", latCoordCheck >= (lat10 - LAT_RADIUS) , latCoordCheck <= (lat10 + LAT_RADIUS) ,lonCoordCheck >= (lon10 - LON_RADIUS) ,lonCoordCheck <= (lon10 + LON_RADIUS))

    if(latCoordCheck >= (lat10 - LAT_RADIUS) && latCoordCheck <= (lat10 + LAT_RADIUS) && lonCoordCheck >= (lon10 - LON_RADIUS) && lonCoordCheck <= (lon10 + LON_RADIUS)) {
      poem = name10
      let timer = (((min10*60) + sec10) * 1000)
      console.log(typeof timer) // making sure timer renders as a number
      if(location != `${url10}` && openTab !== `${url10}` && identifier !== name10) {
        openTab.push(window.open(`${url10}`, '_blank'))
        identifier = name10
        if(openTab[1]) {
          closeTab()
        }
        setTimeout(() => {
          for(let i = 0; i<openTab.length; i++) {
            openTab[i].close()
          }
        }, timer)
      }
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
  longDisplay.innerHTML = 'Not Tracking'
  latDisplay.innerHTML = 'Not Tracking'
  statusDisplay.innerHTML = 'Off'
  console.log('tracking stopped')
}

// Check the state of the on/off toggle
function checkToggle () {
  if(toggle.checked) {
    onIndicator.classList.remove('dim')
    onIndicator.classList.add('lit')
    offIndicator.classList.remove('lit')
    offIndicator.classList.add('dim')
    trackingBox.style.visibility = 'visible'
    startWatch()
  } else {
    offIndicator.classList.remove('dim')
    offIndicator.classList.add('lit')
    onIndicator.classList.remove('lit')
    onIndicator.classList.add('dim')
    trackingBox.style.visibility = 'hidden'

    stopWatch()
  }
}

// Listen for changes to the toggle
toggle.addEventListener('change', checkToggle)