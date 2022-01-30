
import * as Translation from './modules/translate.js';
import './modules/effects.js';
const storage = window.localStorage;

console.log(`
- [x] Вёрстка соответствует макету. Ширина экрана 768px +48
    - [x] блок <header> +6
    - [x] секция hero +6
    - [x] секция skills +6
    - [x] секция portfolio +6
    - [x] секция video +6
    - [x] секция price +6
    - [x] секция contacts +6
    - [x] блок <footer> +6
- [x] Ни на одном из разрешений до 320px включительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется +15
    - [x] нет полосы прокрутки при ширине страницы от 1440рх до 768рх +5
    - [x] нет полосы прокрутки при ширине страницы от 768рх до 480рх +5
    - [x] нет полосы прокрутки при ширине страницы от 480рх до 320рх +5
- [x] На ширине экрана 768рх и меньше реализовано адаптивное меню +22
    - [x] при ширине страницы 768рх панель навигации скрывается, появляется бургер-иконка +2
    - [x] при нажатии на бургер-иконку справа плавно появляется адаптивное меню, бургер-иконка изменяется на крестик +4
    - [x] высота адаптивного меню занимает всю высоту экрана. При ширине экрана 768-620рх вёрстка меню соответствует макету, когда экран становится уже, меню занимает всю ширину экрана +4
    - [x] при нажатии на крестик адаптивное меню плавно скрывается уезжая за правую часть экрана, крестик превращается в бургер-иконку +4
    - [x] бургер-иконка, которая при клике превращается в крестик, создана при помощи css-анимаций без использования изображений +2
    - [x] ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям +2
    - [x] при клике по ссылке в адаптивном меню адаптивное меню плавно скрывается, крестик превращается в бургер-иконку +4
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

