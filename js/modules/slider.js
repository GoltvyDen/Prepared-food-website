function slider() {
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
}

module.exports = slider;