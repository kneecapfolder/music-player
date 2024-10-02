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

        obj.onclick = () => select(obj, this);

        parent.appendChild(obj);
    }
}


const searchBar = document.getElementById('search');
const songList = document.querySelector('nav');
var songs = [];
var selected;


// ipcRenderer.send("save", songs); // JSON.stringify(songList.children)

function select(div, obj) {
    div.children[1].children[0].style.color = 'blue';
    select = obj;
    console.log(obj);
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

loadSongs();