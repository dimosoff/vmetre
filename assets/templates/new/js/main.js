const iconMenu = document.querySelector(".menu-icon");
const menuBody = document.querySelector(".menu-body");
const burgerMenu = document.querySelector(".burger-menu");

let menuBtn = () => {
  if (iconMenu.classList.contains("_active")) {
    document.body.classList.remove("_lock");
    iconMenu.classList.remove("_active");
    menuBody.classList.remove("_active");
  } else {
    document.body.classList.add("_lock");
    iconMenu.classList.add("_active");
    menuBody.classList.add("_active");
  }
};

burgerMenu.addEventListener("click", menuBtn);

const menuLinks = document.querySelectorAll(".get-link[data-goto]");

if (menuLinks.length > 0) {
  menuLinks.forEach((el) => {
    el.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    const menuLink = e.target;
    if (
      menuLink.dataset.goto &&
      document.querySelector(menuLink.dataset.goto)
    ) {
      const gotoBlock = document.querySelector(menuLink.dataset.goto);
      const gotoBlockValue =
        gotoBlock.getBoundingClientRect().top + pageYOffset;

      window.scrollTo({
        top: gotoBlockValue,
        behavior: "smooth",
      });
      e.preventDefault();
    }
  }
}

let minOffset = 61;
let minOffsetScroll = 700;

let windowScroll = (window.onscroll = function () {
  let has_class = document.body.classList.contains("is_scrolled");

  if (minOffset < document.documentElement.scrollTop) {
    if (!has_class) {
      document.body.classList.add("is_scrolled");
    }
  } else if (has_class) {
    document.body.classList.remove("is_scrolled");
  }
});

windowScroll();

let windowScrollBtn = (document.onscroll = function () {
  let has_class_scroll = document.body.classList.contains("is_scrollBtn");

  if (minOffsetScroll < document.documentElement.scrollTop) {
    if (!has_class_scroll) {
      document.body.classList.add("is_scrollBtn");
    }
  } else if (has_class_scroll) {
    document.body.classList.remove("is_scrollBtn");
  }
});

windowScrollBtn();

const getClick = document.querySelector(".get-click");
const searchPanel = document.querySelector(".search-panel");
const removeClass = document.querySelector(".search-panel__close");
const body = document.querySelector("body");

getClick.addEventListener("click", function (e) {
  e.stopPropagation();
  document.body.classList.add("_lock");
  getClick.classList.add("open");
  searchPanel.classList.add("open");
});

searchPanel.addEventListener("click", ({ target }) => {
  if (target === searchPanel || target.classList.contains("open")) {
    console.log(target);
    document.body.classList.remove("_lock");
    getClick.classList.remove("open");
    searchPanel.classList.remove("open");
  }
});

removeClass.addEventListener("click", function (e) {
  e.stopPropagation();
  document.body.classList.remove("_lock");
  getClick.classList.remove("open");
  searchPanel.classList.remove("open");
});

const iconMob = document.querySelector(".mobile-icon");
const headernav = document.querySelector(".header-nav");

const burgerBtn = () => {
  if (iconMob.classList.contains("_active")) {
    document.body.classList.remove("_lock");
    iconMob.classList.remove("_active");
    headernav.classList.remove("_active");
  } else {
    document.body.classList.add("_lock");
    iconMob.classList.add("_active");
    headernav.classList.add("_active");
  }
};

iconMob.addEventListener("click", burgerBtn);

const elLi1 = document.querySelector(".burger-item__info-el1");
const MenuSecondLi1 = document.querySelector(".second-menu-el1");
const BLogo1 = document.querySelector(".burger-logo1");
const elLi2 = document.querySelector(".burger-item__info-el2");
const MenuSecondLi2 = document.querySelector(".second-menu-el2");
const BLogo2 = document.querySelector(".burger-logo2");

const elLi3 = document.querySelector(".burger-item__info-el3");
const MenuSecondLi3 = document.querySelector(".second-menu-el3");
const BLogo3 = document.querySelector(".burger-logo3");

const elLi4 = document.querySelector(".burger-item__info-el4");
const MenuSecondLi4 = document.querySelector(".second-menu-el4");
const BLogo4 = document.querySelector(".burger-logo4");

const elLi5 = document.querySelector(".burger-item__info-el5");
const MenuSecondLi5 = document.querySelector(".second-menu-el5");
const BLogo5 = document.querySelector(".burger-logo5");

const elLi6 = document.querySelector(".burger-item__info-el6");
const MenuSecondLi6 = document.querySelector(".second-menu-el6");
const BLogo6 = document.querySelector(".burger-logo6");

const elLi7 = document.querySelector(".burger-item__info-el7");
const MenuSecondLi7 = document.querySelector(".second-menu-el7");
const BLogo7 = document.querySelector(".burger-logo7");

let itemLi = (
  el,
  menu,
  logo,
  el2,
  el3,
  el4,
  el5,
  el6,
  el7,
  menu2,
  menu3,
  menu4,
  menu5,
  menu6,
  menu7,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7
) => {
  el.addEventListener("click", function (e) {
    el.classList.toggle("active");
    menu.classList.toggle("active");
    logo.classList.toggle("active");
    el2.classList.remove("active");
    el3.classList.remove("active");
    el4.classList.remove("active");
    el5.classList.remove("active");
    el6.classList.remove("active");
    el7.classList.remove("active");
    menu2.classList.remove("active");
    menu3.classList.remove("active");
    menu4.classList.remove("active");
    menu5.classList.remove("active");
    menu6.classList.remove("active");
    menu7.classList.remove("active");
    logo2.classList.remove("active");
    logo3.classList.remove("active");
    logo4.classList.remove("active");
    logo5.classList.remove("active");
    logo6.classList.remove("active");
    logo7.classList.remove("active");
  });
};

itemLi(
  elLi1,
  MenuSecondLi1,
  BLogo1,
  elLi2,
  elLi3,
  elLi4,
  elLi5,
  elLi6,
  elLi7,
  MenuSecondLi2,
  MenuSecondLi3,
  MenuSecondLi4,
  MenuSecondLi5,
  MenuSecondLi6,
  MenuSecondLi7,
  BLogo2,
  BLogo3,
  BLogo4,
  BLogo5,
  BLogo6,
  BLogo7
);
itemLi(
  elLi2,
  MenuSecondLi2,
  BLogo2,
  elLi1,
  elLi3,
  elLi4,
  elLi5,
  elLi6,
  elLi7,
  MenuSecondLi1,
  MenuSecondLi3,
  MenuSecondLi4,
  MenuSecondLi5,
  MenuSecondLi6,
  MenuSecondLi7,
  BLogo1,
  BLogo3,
  BLogo4,
  BLogo5,
  BLogo6,
  BLogo7
);
itemLi(
  elLi3,
  MenuSecondLi3,
  BLogo3,
  elLi2,
  elLi1,
  elLi4,
  elLi5,
  elLi6,
  elLi7,
  MenuSecondLi2,
  MenuSecondLi1,
  MenuSecondLi4,
  MenuSecondLi5,
  MenuSecondLi6,
  MenuSecondLi7,
  BLogo2,
  BLogo1,
  BLogo4,
  BLogo5,
  BLogo6,
  BLogo7
);
itemLi(
  elLi4,
  MenuSecondLi4,
  BLogo4,
  elLi2,
  elLi3,
  elLi1,
  elLi5,
  elLi6,
  elLi7,
  MenuSecondLi2,
  MenuSecondLi3,
  MenuSecondLi1,
  MenuSecondLi5,
  MenuSecondLi6,
  MenuSecondLi7,
  BLogo2,
  BLogo3,
  BLogo1,
  BLogo5,
  BLogo6,
  BLogo7
);
itemLi(
  elLi5,
  MenuSecondLi5,
  BLogo5,
  elLi2,
  elLi3,
  elLi4,
  elLi1,
  elLi6,
  elLi7,
  MenuSecondLi2,
  MenuSecondLi3,
  MenuSecondLi4,
  MenuSecondLi1,
  MenuSecondLi6,
  MenuSecondLi7,
  BLogo2,
  BLogo3,
  BLogo4,
  BLogo1,
  BLogo6,
  BLogo7
);
itemLi(
  elLi6,
  MenuSecondLi6,
  BLogo6,
  elLi2,
  elLi3,
  elLi4,
  elLi5,
  elLi1,
  elLi7,
  MenuSecondLi2,
  MenuSecondLi3,
  MenuSecondLi4,
  MenuSecondLi5,
  MenuSecondLi1,
  MenuSecondLi7,
  BLogo2,
  BLogo3,
  BLogo4,
  BLogo5,
  BLogo1,
  BLogo7
);
itemLi(
  elLi7,
  MenuSecondLi7,
  BLogo7,
  elLi2,
  elLi3,
  elLi4,
  elLi5,
  elLi6,
  elLi1,
  MenuSecondLi2,
  MenuSecondLi3,
  MenuSecondLi4,
  MenuSecondLi5,
  MenuSecondLi6,
  MenuSecondLi1,
  BLogo2,
  BLogo3,
  BLogo4,
  BLogo5,
  BLogo6,
  BLogo1
);

const popularWrappers = document.querySelectorAll(
  ".subcategories-popular-wrapper"
);

if (popularWrappers.length) {
  popularWrappers.forEach(function (el) {
    const popularBtn = el.querySelector("[name='popular-collapse-button']");
    if (!popularBtn) return;
    popularBtn.addEventListener("click", function () {
      el.classList.toggle("_expanded");
    });
  });
}
