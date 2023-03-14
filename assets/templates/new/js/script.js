const swiper = new Swiper('.presentation-slider', {
    slidesPerView: 1,
    dynamicBullets: true,
    pagination:{
        el: '.bullets-custom',
        clickable: true,
    },
    autoplay: {
        delay: 4000,
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
        },
        480: {
            slidesPerView: 1,
        },
        640: {
            slidesPerView: 1,
        }
    }
})
