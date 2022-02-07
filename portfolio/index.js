
import * as Translation from './modules/translate.js';
import './modules/effects.js';
import './modules/video.js';
const storage = window.localStorage;

console.log(`
TL/DR сделано всё, при переводе так же автоматически адаптируюся цены. Есть незначительные отличия от макета, исправляющие его косяки.
Если есть способ сделать так, чтобы при применении сохранённых языка/темы не было сначала рендера "по умолчанию", напишите в отзыве, спасибо)


- [x] Смена изображений в секции portfolio +25
    - [x] при кликах по кнопкам Winter, Spring, Summer, Autumn в секции portfolio отображаются изображения из папки с соответствующим названием +20
    - [x] кнопка, по которой кликнули, становится активной т.е. выделяется стилем. Другие кнопки при этом будут неактивными +5
- [x] Перевод страницы на два языка +25
    - [x] при клике по надписи ru англоязычная страница переводится на русский язык +10
    - [x] при клике по надписи en русскоязычная страница переводится на английский язык +10
    - [x] надписи en или ru, соответствующие текущему языку страницы, становятся активными т.е. выделяются стилем +5
- [x] Переключение светлой и тёмной темы +25
    - [x] Внешний вид тёмной темы соответствует макету, который верстали в предыдущих частях задания, внешний вид светлой темы соответствует первому макету
    - [x] тёмная тема приложения сменяется светлой +10
    - [x] светлая тема приложения сменяется тёмной +10
    - [x] после смены светлой и тёмной темы интерактивные элементы по-прежнему изменяют внешний вид при наведении и клике и при этом остаются видимыми на странице (нет ситуации с белым шрифтом на белом фоне) +5
- [x] Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5
- [x] Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5 (ripple)
`);

function toggleCollapsed(button, collapseTarget) {
    if (collapseTarget.classList.contains("active"))
    {
        collapseTarget.classList.add("pre-active-out");
        collapseTarget.classList.remove("active");
        button.classList.toggle("active");
        window.setTimeout(() => {

            collapseTarget.classList.remove("pre-active-out");

        }, 1000);
    }
    else {
        collapseTarget.classList.add("pre-active");
        button.classList.toggle("active");
        window.setTimeout(() => {
            collapseTarget.classList.toggle("active");
            collapseTarget.classList.remove("pre-active");
        }, 10);
    }
}

function onCollapsableClick(event, button, collapseTarget) {
    if (event.target.classList.contains('nav-link'))
        toggleCollapsed(button, collapseTarget);
}

// Set up collapseable menu
document.addEventListener('DOMContentLoaded', (event) => {
    let collapseButtons = document.querySelectorAll(".collapse-button");
    collapseButtons.forEach(button => {
        let target = button.attributes.getNamedItem("data-collapse-target").value;
        let targetElement = document.getElementById(target);
        button.addEventListener("click", _ => toggleCollapsed(button, targetElement));
        targetElement.addEventListener("click", ev => onCollapsableClick(ev, button, targetElement));
    });
});

/*
    Accepts event-like object. It must have target property with reference to dom element
 */
function switchLanguage(event) {
    let element = event.target;
    if (element.classList.contains('active'))
        return;
    let translationTags = document.querySelectorAll("[data-translation-tag]");
    translationTags.forEach(el => {if (el !== element) el.classList.remove('active');});
    element.classList.add('active');
    localStorage.lang = element.attributes['data-translation-tag'].value;
    Translation.translateTo(element.attributes['data-translation-tag'].value);
}

function setLanguage(languageLabel) {
    let element = document.querySelector(`[data-translation-tag=${languageLabel}]`);
    switchLanguage({target: element});
}

//Set up translation
document.addEventListener('DOMContentLoaded', (event) => {
    let translationTags = document.querySelectorAll("[data-translation-tag]");
    for (let element of translationTags)
        element.addEventListener('click', switchLanguage);
});

var currentTheme = "night";

function toggleTheme() {
    if (currentTheme === "night")
        currentTheme = "day";
    else currentTheme = "night";
    storage.theme = currentTheme;
    document.getElementById("theme").attributes['href'].value = `./assets/themes/${currentTheme}.css`;
}

function setTheme(themeLabel) {
    currentTheme = themeLabel;
    document.getElementById("theme").attributes['href'].value = `./assets/themes/${currentTheme}.css`;
}

//Set up theme toggling
document.addEventListener('DOMContentLoaded', (event) => {
    let themeIcon = document.querySelector(".theme-icon");
    themeIcon.addEventListener('click', toggleTheme);
});

/*
    Accepts event-like object. It must have target property with reference to dom element
 */
function reloadImages(event) {
    if (event.target.classList.contains("button-solid"))
        return;
    let images = document.querySelectorAll("img.gallery-image");
    let season = event.target.attributes['data-selector-id'].value;
    for (let image of images)
    {
        image.src = image.src.replace(/winter|autumn|summer|spring/, season);
    }
    let buttons = document.querySelectorAll("button[data-selector-id]");
    for (let button of buttons)
    {
        if (button !== event.target) {
            button.classList.remove('button-solid');
            button.classList.add('button-outline');
        }
        else {
            button.classList.remove('button-outline');
            button.classList.add('button-solid');
        }
    }
    storage.galleryId = season;
}

function setGallerySelector(galleryLabel) {
    let button = document.querySelector(`button[data-selector-id=${galleryLabel}]`);
    reloadImages({target: button});
}

//Set up image selector
document.addEventListener('DOMContentLoaded', (event) => {
    let buttons = document.querySelectorAll("button[data-selector-id]");
    buttons.forEach(x => x.addEventListener('click', reloadImages));
});


//Set up applying user settings
document.addEventListener('DOMContentLoaded', (event) => {
    if (storage.lang !== undefined)
        setLanguage(storage.lang);
    if (storage.theme !== undefined)
        setTheme(storage.theme);
    if (storage.galleryId !== undefined)
        setGallerySelector(storage.galleryId);
});

