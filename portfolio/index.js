
import * as Translation from './modules/translate.js';
import './modules/effects.js';
import './modules/video.js';
const storage = window.localStorage;

console.log(`
TL/DR сделано всё, добавлен полноэкранный режим, автоматическое скрытие панели управления (если не двигать курсором 5с) и перелистывание по 5с вперёд и назад.


- [x] Вёрстка +10
    - [x] вёрстка видеоплеера: есть само видео, в панели управления есть кнопка Play/Pause, прогресс-бар, кнопка Volume/Mute, регулятор громкости звука +5
    - [x] в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
- [x] Кнопка Play/Pause на панели управления +10
    - [x] при клике по кнопке Play/Pause запускается или останавливается проигрывание видео +5
    - [x] внешний вид и функционал кнопки изменяется в зависимости от того, проигрывается ли видео в данный момент +5
- [x] Прогресс-бар отображает прогресс проигрывания видео. При перемещении ползунка прогресс-бара вручную меняется текущее время проигрывания видео. Разный цвет прогресс-бара до и после ползунка +10
- [x] При перемещении ползунка регулятора громкости звука можно сделать звук громче или тише. Разный цвет регулятора громкости звука до и после ползунка +10
- [x] При клике по кнопке Volume/Mute можно включить или отключить звук. Одновременно с включением/выключением звука меняется внешний вид кнопки. Также внешний вид кнопки меняется, если звук включают или выключают перетягиванием регулятора громкости звука от нуля или до нуля +10
- [x] Кнопка Play/Pause в центре видео +10
    - [x] есть кнопка Play/Pause в центре видео при клике по которой запускается видео и отображается панель управления +5
    - [x] когда видео проигрывается, кнопка Play/Pause в центре видео скрывается, когда видео останавливается, кнопка снова отображается +5
- [x] дополнительный не предусмотренный в задании функционал, улучшающий качество приложения +10?
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

