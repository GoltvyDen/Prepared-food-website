window.addEventListener('DOMContentLoaded', () => {
    
    //Tabs

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

    //Timer 

    const deadLine = '2022-09-01 00:00';
    
    function getTimeReamining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());
        
        if (t<=0){
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor( (t / (1000 * 60 * 60 * 24)) ),
            hours =  Math.floor( (t / (1000 * 60 * 60) % 24) ),
            minutes = Math.floor( (t / (1000 * 60) % 60) ),
            seconds = Math.floor( (t / 1000) % 60 );    
        }
              
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {   
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock() {  
            const t = getTimeReamining(endTime); 
            
            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);
            
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        } 
    }
    
    setClock('.timer', deadLine);

    //Modal

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

    // Making maps by classes

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.konvToUAH();
            
        }

        konvToUAH() {
            this.price = +this.price * this.transfer;
        }

        render() {
            const elem = document.createElement('div');
            if (this.classes.length === 0) {
                this.elem = 'menu__item';
                elem.classList.add(this.elem);
            } else {
                this.classes.forEach(className => elem.classList.add(className));
            }
            
            elem.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(elem);
        }
    }

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });
    
    //Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };
    
    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };


    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
        
            postData('http://localhost:3000/requests', json)            
            .then(data => {
                console.log(data);
                showThanksModal (message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal (message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        prevModalDialog.classList.add('hide');
        openModalByFuction();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModalByFunction();
        }, 3000);
    }

    //SLider
   
    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          backward = document.querySelector('.offer__slider-prev'),
          forward = document.querySelector('.offer__slider-next'),
          totalSlidesNum = document.querySelector('#total'),
          currentSlideNum = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.ofer__slide-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0; 

    function indicatorSlides() {
        if (slides.length < 10) {
            currentSlideNum.textContent =  `0${slideIndex}`;
        } else {
            currentSlideNum.textContent =  slideIndex;
        }
    }

    if (slides.length < 10) {
        totalSlidesNum.textContent = `0${slides.length}`;
        currentSlideNum.textContent =  `0${slideIndex}`;
    } else {
        totalSlidesNum.textContent = slides.length;
        currentSlideNum.textContent =  slideIndex;
    }

    slidesField.style.width = slides.length * 100 + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function enumerationDot() {
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slideIndex-1].style.opacity = 1;
    }

    function leaveOnlyNum(arg) {
        return +arg.replace(/\D/gi, '');   
    }

    forward.addEventListener('click', () => {
        if (offset == leaveOnlyNum(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += leaveOnlyNum(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        
        indicatorSlides();

        enumerationDot();
    });

    backward.addEventListener('click', () => {
        if (offset == 0) { 
            offset = leaveOnlyNum(width) * (slides.length - 1);
        } else {
            offset -= leaveOnlyNum(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        
        indicatorSlides();

        enumerationDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => { 
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = leaveOnlyNum(width) * (slideTo - 1);
            
            slidesField.style.transform = `translateX(-${offset}px)`;
            
            indicatorSlides();
            
            enumerationDot();
        });
    });

    //Calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female', 
        height, weight, age, 
        ratio = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Н/Д';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInf(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(e => {
            e.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInf('#gender', 'calculating__choose-item_active');
    getStaticInf('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInf(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInf('#height');
    getDynamicInf('#weight');
    getDynamicInf('#age');
});
