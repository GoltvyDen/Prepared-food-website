function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    let tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);
    
    function hideTabContent() {
        tabsContent.forEach(it => {
            it.classList.add('hide');
            it.classList.remove('show', 'fade');
        });
        tabs.forEach(it => {
            it.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;
        if(target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((it, i) => {
                if (target == it) {
                    hideTabContent();
                    showTabContent(i); 
                }
            });
        }               
    });
}

export default tabs;