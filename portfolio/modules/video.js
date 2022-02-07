// Custom video player module

let customControlsUsed = false;

function initCustomVideo() {
    customControlsUsed = true;
    if (document.querySelectorAll('link[href="./modules/module-styles/video-style.css"]').length === 0)
        addCssLink();
    // Must have custom-video around
    document.querySelectorAll(".custom-video").forEach(el => setupCustomControls(el));
}

function addCssLink(){
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./modules/module-styles/video-style.css";
    document.head.append(link);
}

const controlsMarkup = `
    <div class="video-controls">
        <div class="control-group playback">
            <button class="custom-icons clickable video-play video-button"></button>
            <input class="video-range progress" type="range" min="0" max="100" value="0">
        </div>
        <div class="control-group">
            <button class="custom-icons clickable video-volume video-button"></button>
            <input class="video-range" type="range" min="0" max="1" step="0.1" value="0">
        </div>
    </div>
`;

const centeredButton = `
    <button class="custom-icons play play-button"></button>
`;

// Depends on slider value being between 0 and 100
function finishSliderStyling(slider) {
    let calcProgress = value => value / (slider.max - slider.min) * 100;
    slider.style.setProperty('--current-progress', calcProgress(slider.value) + '%')
    slider.addEventListener('input', event => event.target.style.setProperty('--current-progress', calcProgress(event.target.value) + '%'));
}

export function setupCustomControls(videoContainer) {
    videoContainer.insertAdjacentHTML('beforeend', centeredButton);
    videoContainer.insertAdjacentHTML('beforeend', controlsMarkup);
    videoContainer.querySelectorAll('.video-range').forEach(el => finishSliderStyling(el));
}

if (document.querySelector("video").canPlayType !== undefined)
    initCustomVideo();