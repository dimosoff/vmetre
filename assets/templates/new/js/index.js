let swiperNew = new Swiper(".content-swiper", {
    navigation: {
        nextEl: ".next-wrapper",
        prevEl: ".prev-wrapper"
    },
    slideToClickedSlide: true,
    slidesPerGroup: 1,
    speed: 800,
    effect: "fade",
    pagination: {
        el: ".fraction-custom",
        type: "fraction",
    }
});

swiperNew.on('slideChange', function(sld) {
    document.body.setAttribute('data-sld', sld.realIndex);
})