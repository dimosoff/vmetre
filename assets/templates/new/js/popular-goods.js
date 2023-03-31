new Swiper('.popular-goods__slider',{
    slideToClickedSlide: true,
    slidesPerView: 4,
    // spaceBetween: 26,
    slidesPerGroup: 1,
    touchRatio: 1,
    grabCursor: true,
    // autoHeight: true,
    // initialSlide: 1,
    speed: 1500,
    dynamicBullets: true,
    pagination:{
        el: '.bullets-custom-popular__goods',
        clickable: true,
    },
    autoplay: {
        delay: 5000,
    },
    breakpoints: {
        // when window width is >= 0px
        0: {
            slidesPerView: 1.5,
            slidesPerGroup: 1,
            centeredSlides: true,
            initialSlide: 1,
        },
        575: {
            slidesPerView: 2.5,
            slidesPerGroup: 2,
            initialSlide: 1,
            slideActiveClass: 'active-slide',
            centeredSlides: true,
            // spaceBetween: 20
        },
        767: {
            slidesPerView: 3.5,
            slidesPerGroup: 3,
            initialSlide: 1,
            slideActiveClass: 'active-slide',
            centeredSlides: true,
            // spaceBetween: 20
        },
        991: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            // spaceBetween: 20
        }
    }
})