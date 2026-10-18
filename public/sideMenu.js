const sideMenu = document.getElementById('side-menu');
const menuButton = document.getElementById('menu-button');
const closeButton = document.getElementById('close-icon');

menuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('menu-visible');
});

closeButton.addEventListener('click', () => {
    sideMenu.classList.remove('menu-visible');
});
