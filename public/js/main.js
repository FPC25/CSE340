const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');

if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menu.classList.toggle('is-open');
    });
}