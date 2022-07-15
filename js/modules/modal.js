function closeModalByFunction(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = ''; //Значение по умолчанию
}

function openModalByFuction(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide'); 
        // Вариант №2 (для этого код нужно менять и в других местах):
            /* modal.style.display = 'block'; */
    document.body.style.overflow = 'hidden';
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}   

function modal(triggerSelector, modalSelector, modalTimerId) {
    const openModal = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);
    
    openModal.forEach(element => {
        element.addEventListener('click', () => openModalByFuction(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModalByFunction(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModalByFunction(modalSelector);
        }
    }); 

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1 /* может быть проблема на некторых браузерах, потому -1 пиксель на всякий случай */) {
            openModalByFuction(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }    
    }
    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModalByFunction};
export {openModalByFuction};