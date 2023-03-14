new Swiper('.popular-goods__slider',{
    slideToClickedSlide: true,
    slidesPerView: 6,
    // spaceBetween: 26,
    slidesPerGroup: 1,
    touchRatio: 1,
    grabCursor: true,
    // autoHeight: true,
    // initialSlide: 1,
    speed: 800,
    dynamicBullets: true,
    pagination:{
        el: '.bullets-custom-popular__goods',
        clickable: true,
    },
    autoplay: {
        delay: 4000,
    },
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1.5,
            centeredSlides: true,
            initialSlide: 1,
        },
        500: {
            slidesPerView: 3.5,
            initialSlide: 1,
            slideActiveClass: 'active-slide',
            centeredSlides: true,
            // spaceBetween: 20
        },
        // when window width is >= 480px
        700: {
            slidesPerView: 5,
            // spaceBetween: 20
        },
        // when window width is >= 640px
        1250: {
            slidesPerView: 6,
            // spaceBetween: 26
        }
    }
})