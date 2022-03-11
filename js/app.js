const longDisplay = document.getElementById('longDisplay')
const latDisplay = document.getElementById('latDisplay')
const statusDisplay = document.getElementById('tracking')
const trackingBox = document.getElementById('tracking-message-box')
const sheets = document.getElementById('sheets')

const toggle = document.getElementById('tracking-toggle')
const onIndicator = document.getElementById('on')
const offIndicator = document.getElementById('off')
const leftArrow = document.querySelector('.arrow')
const mainHeaderImage = document.getElementById('main-header')

const MASTER_URL = 'https://docs.google.com/spreadsheets/d/1AQMb2Whd0s7h0ceczLrJzPai5zNXgZBHl1qR5pO3Aog/gviz/tq?tqx=out:json'
const TESTING_URL = 'https://docs.google.com/spreadsheets/d/1UXk1YdG3AOJQ2YkSMxBG5PWebQGkO_TXq5Ni7s6ffws/gviz/tq?tqx=out:json'

//Constants for establishing an equal perimeter. Can be adjusted to fit the bounding area
const LAT_RADIUS = 0.000240
const LON_RADIUS = 0.000240 // 70 ft radius .000024 = 7ft ~.00000343 = 1ft

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
let tabHasLaunched = false;

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

//========FUNCTIONS========\\

// Close previously opened tabs
function closeTab() {
  openTab[0].close()
  console.log("tabs closed")
}

// Create variables 
const createLat = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lat${i + 1}`] = `${obj[i].c[0].v}`
  }
}
const createLon = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lon${i + 1}`] = `${obj[i].c[1].v}`
  }
}
const createUrl = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`url${i + 1}`] = `${obj[i].c[2].v}`
  }
}
const createYoutubeUrl = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`youtubeUrl${i + 1}`] = `${obj[i].c[3].v}`
  }
}
const createMin = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`min${i + 1}`] = `${obj[i].c[5].v}`
  }
}
const createSec = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`sec${i + 1}`] = `${obj[i].c[6].v}`
  }
}
const createName = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`name${i + 1}`] = `${obj[i].c[7].v}`
  }
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

    // -- there should be a more dynamic way to set the variables --DONE
    // -- Add functionality that assigns variables to each group of variable types --DONE
      let resultLength = Object.keys(result).length // set length for dynamic variable rendering

      // Calling functions to dynamically render variables
      createLat(result, resultLength)
      createLon(result, resultLength)
      createUrl(result, resultLength)
      createYoutubeUrl(result, resultLength)
      createMin(result, resultLength)
      createSec(result, resultLength)
      createName(result, resultLength)
    
    

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    // console.log("poem 1", latCoordCheck >= (lat1 - LAT_RADIUS) , latCoordCheck <= (lat1 + LAT_RADIUS) ,lonCoordCheck >= (lon1 - LON_RADIUS) ,lonCoordCheck <= (lon1 + LON_RADIUS))

    // Conditionally checking and functionality of launching external sites

    // if the coordinate bounding box is entered
    // Use classes to render these? --
    // POEM 1 ////////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat1 - LAT_RADIUS) && latCoordCheck <= (lat1 + LAT_RADIUS) && lonCoordCheck >= (lon1 - LON_RADIUS) && lonCoordCheck <= (lon1 + LON_RADIUS)) {
        poem = name1.replace(/\s+/g, '')
        url1 = youtubeUrl1
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min1*60) + sec1) * 1000)
        // if the window has not previously been opened
        if(openTab[0] !== `${url1}` && openTab !== `${url1}` && identifier !== name1) {
  
          // launch the new window with the poems page and push the location of the open tab to openTab
          openTab.push(window.open(`${url1}`, '_blank'))
  
          // Set identifier to current poem
          identifier = name1

          // Set boolean to true for conditional testing
          tabHasLaunched = true
          
          // If a tab already exists, close it
          if(openTab[1]) {
            closeTab()
          }
  
          // Auto close the tab after the length of the current poem has passed
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()

              // Set conditional test back to false
              tabHasLaunched = false;
            }
          }, timer)
        }
      sheets.innerText = poem // Output the name of the current poem
      }
    }

    // there will be the same code block for each location
    // maybe these can be modularized
    // console.log("poem 2", latCoordCheck >= (lat2 - LAT_RADIUS) , latCoordCheck <= (lat2 + LAT_RADIUS) ,lonCoordCheck >= (lon2 - LON_RADIUS) ,lonCoordCheck <= (lon2 + LON_RADIUS))
    // POEM 2 ///////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat2 - LAT_RADIUS) && latCoordCheck <= (lat2 + LAT_RADIUS) && lonCoordCheck >= (lon2 - LON_RADIUS) && lonCoordCheck <= (lon2 + LON_RADIUS)) {
        poem = name2.replace(/\s+/g, '')
        url2 = youtubeUrl2
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min2*60) + sec2) * 1000)
        if(location != `${url2}` && openTab !== `${url2}` && identifier !== name2) {
          openTab.push(window.open(`${url2}`, '_blank'))
          identifier = name2
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 3 ////////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat3 - LAT_RADIUS) && latCoordCheck <= (lat3 + LAT_RADIUS) && lonCoordCheck >= (lon3 - LON_RADIUS) && lonCoordCheck <= (lon3 + LON_RADIUS)) {
        poem = name3.replace(/\s+/g, '')
        url3 = youtubeUrl3
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min3*60) + sec3) * 1000)
        if(location != `${url3}` && openTab !== `${url3}` && identifier !== name3) {
          openTab.push(window.open(`${url3}`, '_blank'))
          identifier = name3
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 4 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat4 - LAT_RADIUS) && latCoordCheck <= (lat4 + LAT_RADIUS) && lonCoordCheck >= (lon4 - LON_RADIUS) && lonCoordCheck <= (lon4 + LON_RADIUS)) {
        poem = name4.replace(/\s+/g, '')
        url4 = youtubeUrl4
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min4*60) + sec4) * 1000)
        if(location != `${url4}` && openTab !== `${url4}` && identifier !== name4) {
          openTab.push(window.open(`${url4}`, '_blank'))
          identifier = name4
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 5 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat5 - LAT_RADIUS) && latCoordCheck <= (lat5 + LAT_RADIUS) && lonCoordCheck >= (lon5 - LON_RADIUS) && lonCoordCheck <= (lon5 + LON_RADIUS)) {
        poem = name5.replace(/\s+/g, '')
        url5 = youtubeUrl5
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min5*60) + sec5) * 1000)
        if(location != `${url5}` && openTab !== `${url5}` && identifier !== name5) {
          openTab.push(window.open(`${url5}`, '_blank'))
          identifier = name5
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 6 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat6 - LAT_RADIUS) && latCoordCheck <= (lat6 + LAT_RADIUS) && lonCoordCheck >= (lon6 - LON_RADIUS) && lonCoordCheck <= (lon6 + LON_RADIUS)) {
        poem = name6.replace(/\s+/g, '')
        url6 = youtubeUrl6
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`

        let timer = (((min6*60) + sec6) * 1000)
        if(location != `${url6}` && openTab !== `${url6}` && identifier !== name6) {
          openTab.push(window.open(`${url6}`, '_blank'))
          identifier = name6
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 7 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat7 - LAT_RADIUS) && latCoordCheck <= (lat7 + LAT_RADIUS) && lonCoordCheck >= (lon7 - LON_RADIUS) && lonCoordCheck <= (lon7 + LON_RADIUS)) {
        poem = name7.replace(/\s+/g, '')
        url7 = youtubeUrl7
        mainHeaderImage.style.backgroundImage = `"url(/image/${poem}.jpg)"`

        let timer = (((min7*60) + sec7) * 1000)
        if(location != `${url7}` && openTab !== `${url7}` && identifier !== name7) {
          openTab.push(window.open(`${url7}`, '_blank'))
          identifier = name7
          tabHasLaunched = true;
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 8 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat8 - LAT_RADIUS) && latCoordCheck <= (lat8 + LAT_RADIUS) && lonCoordCheck >= (lon8 - LON_RADIUS) && lonCoordCheck <= (lon8 + LON_RADIUS)) {
        poem = name8.replace(/\s+/g, '')
        url8 = youtubeUrl8
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min8*60) + sec8) * 1000)
        if(location != `${url8}` && openTab !== `${url8}` && identifier !== name8) {
          openTab.push(window.open(`${url8}`, '_blank'))
          identifier = name8
          tabHasLaunched = true;
          console.log(tabHasLaunched)
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
              console.log(tabHasLaunched)
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 9 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat9 - LAT_RADIUS) && latCoordCheck <= (lat9 + LAT_RADIUS) && lonCoordCheck >= (lon9 - LON_RADIUS) && lonCoordCheck <= (lon9 + LON_RADIUS)) {
        poem = name9.replace(/\s+/g, '')
        url9 = youtubeUrl9
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min9*60) + sec9) * 1000)
        if(location != `${url9}` && openTab !== `${url9}` && identifier !== name9) {
          openTab.push(window.open(`${url9}`, '_blank'))
          identifier = name9
          tabHasLaunched = true;
          console.log(tabHasLaunched)
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
              console.log(tabHasLaunched)
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }
    }

    // POEM 10 //////
    if(!tabHasLaunched) {
      if(latCoordCheck >= (lat10 - LAT_RADIUS) && latCoordCheck <= (lat10 + LAT_RADIUS) && lonCoordCheck >= (lon10 - LON_RADIUS) && lonCoordCheck <= (lon10 + LON_RADIUS)) {
        poem = name10.replace(/\s+/g, '')
        url10 = youtubeUrl10
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        console.log("header image", mainHeaderImage.style.backgroundImage)
        let timer = (((min10*60) + sec10) * 1000)
        if(location != `${url10}` && openTab !== `${url10}` && identifier !== name10) {
          openTab.push(window.open(`${url10}`, '_blank'))
          identifier = name10
          tabHasLaunched = true;
          console.log(tabHasLaunched)
          if(openTab[1]) {
            closeTab()
          }
          setTimeout(() => {
            for(let i = 0; i<openTab.length; i++) {
              openTab[i].close()
              tabHasLaunched = false;
              console.log(tabHasLaunched)
            }
          }, timer)
        }
        sheets.innerText = poem
  
      }

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
    trackingBox.classList.add('bounce-animation')
    leftArrow.style.display = 'none'
    startWatch()
  } else {
    offIndicator.classList.remove('dim')
    offIndicator.classList.add('lit')
    onIndicator.classList.remove('lit')
    onIndicator.classList.add('dim')
    trackingBox.style.visibility = 'hidden'
    trackingBox.classList.remove('bounce-animation')
    leftArrow.style.display = 'flex'
    stopWatch()
  }
}

// Listen for changes to the toggle
toggle.addEventListener('change', checkToggle)