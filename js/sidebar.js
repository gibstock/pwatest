const sidebar = document.getElementById('sidebar')
const closeBtn = document.getElementById('closeBtn')
const openBtn = document.getElementById('openBtn')
const details = document.getElementById('details')
const arrow = document.querySelector('.arrow')
const detailsBtn = document.querySelector('input[type="button"]')


function openMobileNav() {
  sidebar.style.width = "250px";

}

function closeMobileNav() {
  sidebar.style.width = '0'
}

const toggleDetails = () => {
  if(details.style.display === 'none') {
    details.style.display = 'inherit'
    arrow.style.width = '2em'
    arrow.style.top = '0'
    arrow.style.left = '-30%'

  } else {
    details.style.display = 'none'
    arrow.style.width = '5em'
    arrow.style.top = '-100%'
    arrow.style.left = '-60%'

  }
}

openBtn.addEventListener('click', openMobileNav)
closeBtn.addEventListener('click', closeMobileNav)
detailsBtn.addEventListener('click', toggleDetails)