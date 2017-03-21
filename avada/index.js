
document.addEventListener("DOMContentLoaded", function(event) {
    (function menuToggle() {
        let menu = document.getElementsByClassName('menu-bar')[0];
        let dropdown = document.getElementsByClassName('menu-drop-down')[0];
        let dropdownStyle = dropdown.style;
        menu.addEventListener('click', (evt) => {
            // show drop-down-menu
            if (menu.className.includes('hidden')) {
                menu.classList.remove('hidden');
                dropdownStyle.display = 'block';
            }
            // hide drop-down-menu
            else {
                menu.className += ' ' + 'hidden';
                dropdownStyle.display = 'none';
            }
        })
    })();
});
