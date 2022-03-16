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

// For testing only
const stopBtn = document.getElementById('stop-sound')
stopBtn.style.display = 'none'


const MASTER_URL = 'https://docs.google.com/spreadsheets/d/1AQMb2Whd0s7h0ceczLrJzPai5zNXgZBHl1qR5pO3Aog/gviz/tq?tqx=out:json'
const TESTING_URL = 'https://docs.google.com/spreadsheets/d/1UXk1YdG3AOJQ2YkSMxBG5PWebQGkO_TXq5Ni7s6ffws/gviz/tq?tqx=out:json'
const SOUND_DRIVE_URL = 'https://docs.google.com/uc?export=download&id='

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

// Initiate Sound file
class Sound {
  constructor(src) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.setAttribute('preload', 'auto')
    this.sound.setAttribute('controls', 'none')
    this.sound.style.display = 'none'
    document.body.appendChild(this.sound)
    this.play = function () {
      this.sound.play()
    }
    this.stop = function () {
      this.sound.pause()
    }
  }
}


// let sound1 = new Sound('../sound/poem1.mp3')
// let sound1 = new Sound('https://docs.google.com/uc?export=download&id=1PhqYAw8-INVo6-QWHVPZJADOsmwXtzem')

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

// Play and Stop Sounds
function playSound(soundUrl, timer) {
  let soundFile = new Sound(soundUrl)
  stopBtn.addEventListener('click', () => {
    soundFile.stop()
    stopBtn.style.display = 'none'
    console.log("Sound Stopped")
  })
  stopBtn.style.display = 'flex'
  stopBtn.style.position = 'absolute'
  stopBtn.style.bottom = '40%'
  stopBtn.style.left = '50%'
  stopBtn.style.transform = 'translateX(-50%)'
  stopBtn.style.border = 'none'
  stopBtn.style.borderRadius = '12px'
  stopBtn.style.padding = '1em'
  stopBtn.style.fontSize = '1.5em'
  stopBtn.style.backgroundColor = 'hsla(0, 0%, 100%, .7'
  soundFile.play()
  console.log("sound playing")
  setTimeout(() => {
    soundFile.stop()
    stopBtn.style.display = 'none'
    console.log("sound stopped")

  }, timer)
}


// Close previously opened tabs
function closeTab() {
  openTab[0].close()
  console.log("tabs closed")
}

// Create variables 
const createLat = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lat${i + 1}`] = parseFloat(`${obj[i].c[0].v}`) // COLUMN A
  }
}
const createLon = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`lon${i + 1}`] = parseFloat(`${obj[i].c[1].v}`) // COLUMN B
  }
}
const createUrl = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`url${i + 1}`] = `${obj[i].c[2].v}`            // COLUMN C
  }
}
const createYoutubeUrl = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`youtubeUrl${i + 1}`] = `${obj[i].c[3].v}`    // COLUMN D
  }
}
const createMin = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`min${i + 1}`] = `${obj[i].c[5].v}`          // COLUMN F
  }
}
const createSec = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`sec${i + 1}`] = `${obj[i].c[6].v}`         // COLUMN G
  }
}
const createName = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`name${i + 1}`] = `${obj[i].c[7].v}`       // COLUMN H
  }
}
const createLocation = (obj, objLen) => {
  for(let i = 0; i < objLen; i++){
    this[`loc${i + 1}`] = `${obj[i].c[8].v}`       // COLUMN I
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

      console.log("RESULT", result)

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
      createLocation(result, resultLength)
    
    

    console.log('fetched')
    
    //  for displaying the coordinates - testing purposes
    latDisplay.innerHTML = position.coords.latitude
    longDisplay.innerHTML = position.coords.longitude
    latCoordCheck = position.coords.latitude
    lonCoordCheck = position.coords.longitude

    //testing truthiness of condition
    // console.log("poem 1", latCoordCheck >= (lat1 - LAT_RADIUS) , latCoordCheck <= (lat1 + LAT_RADIUS) ,lonCoordCheck >= (lon1 - LON_RADIUS) ,lonCoordCheck <= (lon1 + LON_RADIUS))
    // console.log(lonCoordCheck, lon1, LON_RADIUS, typeof (lon1 + LON_RADIUS))


    // Conditionally checking and functionality of launching external sites

    // if the coordinate bounding box is entered
    // Use classes to render these? --
    // POEM 1 ////////
    // if(!tabHasLaunched) {
      if(latCoordCheck >= (lat1 - LAT_RADIUS) && latCoordCheck <= (lat1 + LAT_RADIUS) && lonCoordCheck >= (lon1 - LON_RADIUS) && lonCoordCheck <= (lon1 + LON_RADIUS)) {
        poem = name1.replace(/\s+/g, '')
        url1 = youtubeUrl1
        mainHeaderImage.style.backgroundImage = `url(/image/${poem}.jpg)`
        let timer = (((min1*60) + sec1) * 1000)
        let soundFile = SOUND_DRIVE_URL + url1
        // TEST SOUND ACTIVATIONS //

        // function playSound() {
        //   stopBtn.style.display = 'flex'
        //   sound1.play()
        //   console.log("sound playing")
        //   setTimeout(() => {
        //     sound1.stop()
        //     stopBtn.style.display = 'none'
        //     console.log("sound stopped")
  
        //   }, timer)
        // }
        playSound(soundFile, timer)

        // // if the window has not previously been opened
        // if(openTab[0] !== `${url1}` && openTab !== `${url1}` && identifier !== name1) {
  
        //   // launch the new window with the poems page and push the location of the open tab to openTab
        //   openTab.push(window.open(`${url1}`, '_blank'))
  
        //   // Set identifier to current poem
        //   identifier = name1

        //   // Set boolean to true for conditional testing
        //   tabHasLaunched = true
          
        //   // If a tab already exists, close it
        //   if(openTab[1]) {
        //     closeTab()
        //   }
  
        //   // Auto close the tab after the length of the current poem has passed
        //   setTimeout(() => {
        //     for(let i = 0; i<openTab.length; i++) {
        //       openTab[i].close()

        //       // Set conditional test back to false
        //       tabHasLaunched = false;
        //     }
        //   }, timer)
        // }
      sheets.style.fontWeight = 'bold'  
      sheets.innerText = loc1 // Output the name of the current poem or location
      }
    // }

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

function locationPermissionInstructions() {
  let main = document.querySelector('main')
  let div = document.createElement('div')
  div.innerHTML = `<h4>Location Services must be turned on for the App to work</h4>
  <ol style="padding: 1em; font-size: 1.2em">
    <li>Launch <b><em>Phone Settings</em></b> app on your device.</li>
    <li>Open the <b><em>Privacy</em></b> menu and choose the <b><em>Location Services</em></b> sub-menu</li>
    <li>Enable the <b><em>Location Services</em></b> toggle</li>
    <li>Scroll down on the <b><em>Location Services</em></b> page, and select your <em>Browser</em> from the list</li>
    <li>Choose either <b><em>Ask Next Time</em></b> or <b><em>While Using the App</em></b></li>
    <li>After tracking is allowed, please <b><em>Refresh<em></b> the App or Browser</li>
  </ol>
  <div id="button-wrapper">
    <button id="close-popup">DISMISS</button>
  </div>
  `
  div.style.position = 'absolute'
  div.style.width = '80vw'
  div.style.padding = '1em'
  div.style.margin = '1em'
  div.style.zIndex = '2'
  div.style.top = '0'
  div.style.left = '50%'
  div.style.transform = 'translate(-50%)'
  div.style.background = 'hsla(0, 0%, 30%, .7)'
  div.style.borderRadius = '12px'
  div.style.color ='#fff'
  main.appendChild(div)
  let button = document.getElementById('close-popup')
  let btnWrapper = document.getElementById('button-wrapper')
  btnWrapper.style.display = 'flex'
  btnWrapper.style.flexFlow = 'column'
  btnWrapper.style.justifyContent = 'center'
  button.style.padding = '1em'
  button.style.textAlign = 'center'
  button.addEventListener('click', ()=> {
    div.style.display = 'none'
  })
}

// error handling
function positionError( error ) {
  switch (error.code) {
    case error.PERMISSION_DENIED:

      console.error("User denied the request for Geolocation")
      if(/Android|Pixel|iPhone|iPad|iPod/i.test(navigator.userAgent)){
        locationPermissionInstructions()
      }
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