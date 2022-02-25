const sidebar = document.getElementById('sidebar')
const closeBtn = document.getElementById('closeBtn')
const openBtn = document.getElementById('openBtn')

function openMobileNav() {
  sidebar.style.width = "250px";

}

function closeMobileNav() {
  sidebar.style.width = '0'
}

console.log('hello from sidebar')

openBtn.addEventListener('click', openMobileNav)
closeBtn.addEventListener('click', closeMobileNav)