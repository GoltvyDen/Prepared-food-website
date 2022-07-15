function tabs() {
    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');
    
    function hideTabContent() {
        tabsContent.forEach(it => {
            it.classList.add('hide');
            it.classList.remove('show', 'fade');
        });
        tabs.forEach(it => {
            it.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (et) => {
        const target = et.target;
        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((it, i) => {
                if (target == it) {
                    hideTabContent();
                    showTabContent(i); 
                }
            });
        }               
    });
}

module.exports = tabs;