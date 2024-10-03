const { ipcRenderer } = require('electron');

class Song {
    constructor(json) {
        this.name = json.name;
        this.artist = json.artist;
        this.img = json.img;
        this.link = json.link;
    }

    createObj(parent) {
        let obj = document.createElement('div');
        obj.classList.add('song');

        // Song cover
        let elm = document.createElement('img');
        elm.src = this.img;
        obj.appendChild(elm)

        // Info
        elm = document.createElement('div');
        elm.appendChild(document.createElement('h1'));
        elm.appendChild(document.createElement('p'));
        elm.children[0].innerText = this.name;
        elm.children[1].innerText = this.artist;
        obj.appendChild(elm)
        this.obj = obj;

        this.obj.onclick = () => pickSong(this);
        
        parent.appendChild(this.obj);
    }
}

const searchBar = document.getElementById('search');
const songList = document.querySelector('nav');
const root = document.querySelector(':root');
var songs = [];
let playing = false;
let changing = false;

// Audio player
const progress = document.getElementById('progress');
const audio = document.querySelector('audio');
const currTime = document.getElementById('currTime');
const endTime = document.getElementById('endTime');



progress.addEventListener('input', () => {
    changing = true;
    audio.pause();
    fillSlider();
});
progress.addEventListener('change', () => {
    audio.currentTime = progress.value;
    changing = false;
    if (playing)
        audio.play();
});

setInterval(() => {
    if (!changing) {
        progress.value = audio.currentTime;
        fillSlider();
    }
}, 100);

function pickSong(selected) {
    selected.obj.children[1].children[0].style.color = 'blue';
    audio.src = '../music/feel good inc.mp3';
}

audio.onloadedmetadata = () => {
    endTime.innerHTML = formatTime(audio.duration.toFixed(0));
    progress.setAttribute('max', audio.duration.toFixed(0));
    audio.currentTime = 0;
    progress.value = 0;
    fillSlider();
    currTime.innerHTML = '0:00';
    playBtn(document.getElementById('play'));
}

audio.onended = () => {
    // let index = songs.indexOf()
}

let formatTime = (t) => {
    return `${parseInt(t/60)}:${parseInt(t%60) < 10 ? '0' : ''}${parseInt(t%60)}`;
}

function playBtn(btn) {
    let paused = audio.paused;
    btn.innerHTML = paused?
        `<i class="fa-solid fa-circle-pause"></i>` :
        `<i class="fa-solid fa-circle-play"></i>`;
    if (paused) audio.play();
    else audio.pause();
    playing = paused;
}

async function loadSongs() {
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(elm => {
                new Song(elm).createObj(songList); // Add songs to the song list
            });
        });
}

function fillSlider() {
    root.style.setProperty('--progress', `${progress.value / progress.max * 100}%`);
    currTime.innerHTML = formatTime(progress.value);
}

loadSongs();
