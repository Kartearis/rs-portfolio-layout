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
    <div class="video-controls hidden">
        <div class="control-group playback">
            <button class="custom-icons clickable video-play video-button"></button>
            <input class="video-range progress" type="range" min="0" max="100" step="0.5" value="0">
        </div>
        <div class="control-group volume">
            <button class="custom-icons clickable video-volume video-button"></button>
            <input class="video-range volume" type="range" min="0" max="1" step="0.1" value="0">
        </div>
    </div>
`;

const centeredButton = `
    <button class="custom-icons play play-button"></button>
`;

// Depends on slider value being between 0 and 100
function finishSliderStyling(slider) {
    let calcProgress = event => event.target.value / (event.target.max - event.target.min) * 100;
    slider.style.setProperty('--current-progress', calcProgress({'target': slider}) + '%')
    slider.addEventListener('input', event => event.target.style.setProperty('--current-progress', calcProgress(event) + '%'));
    slider.addEventListener('progChange', event => event.target.style.setProperty('--current-progress', calcProgress(event) + '%'));
}

class VideoControl {
    video = null;
    progressBar = null;
    volumeButton = null;
    volumeBar = null;
    playButton = null;
    bigPlayButton = null;
    controls = null;
    audio = new Proxy({
        'muted': false,
        'currentVolume': 0,
        'handlers': {
            'muted': [],
            'currentVolume': []
        }
    }, {
        set: (target, property, value) => {
            target[property] = value;
            if (target.handlers[property] !== undefined) target.handlers[property].forEach(h => h());
            return true;
        }
    });

    constructor(video, controls, progressBar, volumeBar, volumeButton, playButton, bigPlayButton) {
        this.video = video;
        this.controls = controls;
        this.video.controls = false;
        this.progressBar = progressBar;
        this.volumeButton = volumeButton;
        this.volumeBar = volumeBar;
        this.playButton = playButton;
        this.bigPlayButton = bigPlayButton;
        this.audio.handlers['currentVolume'].push(this.syncVolume, this.updateVolumeIcon);
        this.audio.handlers['muted'].push(this.syncVolume, this.updateVolumeIcon);

        this.bigPlayButton.addEventListener('click', this.togglePlayback);
        this.bigPlayButton.addEventListener('click', this.showControls, {'once': true});
        this.playButton.addEventListener('click', this.togglePlayback);
        this.volumeButton.addEventListener('click', this.mute);
        this.volumeBar.addEventListener('input', this.setVolume);
        this.progressBar.addEventListener('input', this.setProgress);

        this.setupVideoEvents();
    }

    setupVideoEvents = () => {
        this.video.addEventListener('timeupdate', this.updateProgress);
        this.video.addEventListener('play', this.updatePlayIcons);
        this.video.addEventListener('pause', this.updatePlayIcons);
        this.video.addEventListener('loadedmetadata', event => this.progressBar.max = Math.round(this.video.duration));
    }

    showControls = event => {
        this.controls.classList.remove('hidden');
    }

    togglePlayback = event => {
        if (this.video.paused || this.video.ended) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    syncVolume = () => {
        this.video.volume = this.audio.currentVolume;
        this.video.muted = this.audio.muted;
    }

    updateVolumeIcon = () => {
        if (this.audio.muted)
            this.volumeButton.classList.add('muted');
        else this.volumeButton.classList.remove('muted');
    }

    updatePlayIcons = () => {
        if (this.video.paused || this.video.ended) {
            this.playButton.classList.remove('playing');
            this.bigPlayButton.classList.remove('playing');
        }
        else {
            this.playButton.classList.add('playing');
            this.bigPlayButton.classList.add('playing');
        }
    }

    setVolume = event => {
        if (this.volumeBar.value !== event.target.value)
            this.volumeBar.value = event.target.value;
        this.audio.muted = event.target.value == 0;
        this.audio.currentVolume = event.target.value;
    }

    setProgress = event => {
        this.video.currentTime = event.target.value;
    }

    updateProgress = event => {
        this.progressBar.value = this.video.currentTime;
        this.progressBar.dispatchEvent(new Event('progChange', {bubbles:true}));
    }

    mute = event => {
        this.audio.muted = !this.audio.muted;
    }
}




export function setupCustomControls(videoContainer) {
    videoContainer.insertAdjacentHTML('beforeend', centeredButton);
    videoContainer.insertAdjacentHTML('beforeend', controlsMarkup);
    videoContainer.querySelectorAll('.video-range').forEach(el => finishSliderStyling(el));
    let progress = videoContainer.querySelector(".video-range.progress");
    let volumeButton = videoContainer.querySelector(".video-volume");
    let playButton = videoContainer.querySelector(".video-play");
    let bigPlayButton = videoContainer.querySelector(".play-button");
    let volumeBar = videoContainer.querySelector(".video-range.volume");
    let videoControl = new VideoControl(videoContainer.querySelector("video"), videoContainer.querySelector('.video-controls'), progress, volumeBar, volumeButton, playButton, bigPlayButton);
    volumeBar.value = 0.5;
    volumeBar.dispatchEvent(new Event('input', {bubbles:true}));
    return videoControl;
}

if (document.querySelector("video").canPlayType !== undefined)
    initCustomVideo();