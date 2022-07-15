function modal() {
    const openModal = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    
    openModal.forEach(element => {
        element.addEventListener('click', openModalByFuction);
    });

    function closeModalByFunction() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //Значение по умолчанию
    }
    
    function openModalByFuction() {
        modal.classList.add('show');
        modal.classList.remove('hide'); 
            // Вариант №2 (для этого код нужно менять и в других местах):
                /* modal.style.display = 'block'; */
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }   
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModalByFunction();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModalByFunction();
        }
    }); 

    const modalTimerId = setTimeout(openModalByFuction, 60000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1 /* может быть проблема на некторых браузерах, потому -1 пиксель на всякий случай */) {
            openModalByFuction();
            window.removeEventListener('scroll', showModalByScroll);
        }    
    }
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;