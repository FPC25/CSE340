const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');

if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menu.classList.toggle('is-open');
    });
}

document.querySelectorAll('.password-toggle').forEach((button) => {
    const input = document.getElementById(button.dataset.passwordTarget);

    if (!input) return;

    button.addEventListener('click', () => {
        const showing = input.type === 'password';

        input.type = showing ? 'text' : 'password';
        button.textContent = showing ? 'Hide' : 'Show';
        button.setAttribute('aria-pressed', String(showing));
    });
});

const projectViewButtons = document.querySelectorAll('[data-project-view]');
const projectViewPanels = document.querySelectorAll('[data-project-panel]');

if (projectViewButtons.length > 0 && projectViewPanels.length > 0) {
    const storageKey = 'dashboard-project-view';
    let initialView = 'cards';

    try {
        const savedView = window.localStorage.getItem(storageKey);
        if (savedView === 'cards' || savedView === 'list') {
            initialView = savedView;
        }
    } catch {}

    const setProjectView = (view, save = true) => {
        if (view !== 'cards' && view !== 'list') return;

        projectViewPanels.forEach((panel) => {
            panel.hidden = panel.dataset.projectPanel !== view;
        });

        projectViewButtons.forEach((button) => {
            button.setAttribute(
                'aria-pressed',
                String(button.dataset.projectView === view)
            );
        });

        if (save) {
            try {
                window.localStorage.setItem(storageKey, view);
            } catch {}
        }
    };

    projectViewButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setProjectView(button.dataset.projectView);
        });
    });

    setProjectView(initialView, false);
}