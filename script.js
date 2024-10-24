console.log("Javascript Starts");
let currentSong = new Audio();
let songs;
let currFolder;



// function for seconds to minutes
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  console.log(folder);
  
  let songName = [];
  let artistName = [];
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  for (let index = 0; index < songs.length; index++) {
    const element = songs[index];
    // console.log(songs);
    
    songName.push(element.split("by")[0]);
    artistName.push(element.split("by")[1]);
  }

   
  //show all the songs into the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUl.innerHTML = "";

  for (let index = 0; index < songName.length; index++) {
    // console.log("5");

    const songNames = songName[index];
    const artistNames = artistName[index];
// console.log(songName);


    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                    <div class="playlistSong cursor-pointer flex">
                    <div class="flex cursor-pointer gap-20">
                      <img class="playlistSongIcon" src="img/flute.svg" alt="">
                    <div class="song-info">
                      <div class="songName"> ${songNames
                        .replaceAll("%20", " ")
                        .trim()} </div>
                      <div class="artistName">${artistNames
                        .replaceAll("%20", " ")
                        .split(".mp3")[0]
                        .trim()}</div> 
                      
                    </div>
                    </div>
                    <div class="songPlayBtn">Play</div></div>
                  </li>`;
  }


    // attach event listener to each song

  let track = document
    .querySelector(".song-info")
    .firstElementChild.innerHTML.trim();
  let artist = document
    .querySelector(".song-info")
    .getElementsByTagName("div")[1]
    .innerHTML.trim();
  playMusic(track, artist, false);

  let songArray = Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  );
  for (let index = 0; index < songArray.length; index++) {
    const element = songArray[index];
  }
  songArray.forEach((e) => {
    e.addEventListener("click", (element) => {
      track = e.querySelector(".song-info").firstElementChild.innerHTML.trim();
      artist = e
        .querySelector(".song-info")
        .getElementsByTagName("div")[1]
        .innerHTML.trim();

      playMusic(track, artist);
      // console.log(track, artist);
    });
  });

  return songs;
}
//  play the music from your library

const playMusic = (track, artist, pause = false) => {
  currentSong.src =
    `/${currFolder}/` +
    track.replaceAll(" ", "%20") +
    "%20by%20" +
    artist.replaceAll(" ", "%20") +
    ".mp3";
  if (!pause) {
    currentSong.play();
    document.getElementById("playBtn").src = "img/pause.svg";
  }

  //  playbar display song name
  document.querySelector(".songTitle").innerHTML = track + " - " + artist;
};



async function displayPlaylistAlbums() {

  console.log(`displaying playlist Albums`); 
  let a = await fetch('/fav/')
  let response = await a.text();
  // console.log(response);
  let div = document.createElement('div')
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
  console.log(array);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.href.includes('/fav/')) {
      console.log(element);
      let folder = element.href.split('/').slice(-1)[0]
      // console.log(folder);
      // get the metadata of the folder
      let a = await fetch(`fav/${folder}/info.json`)
      let response = await a.json()
      playlistCardContainer = document.querySelector(".playlistCardContainer")
      playlistCardContainer.innerHTML +=  `<div data-folder= "${folder}"  class="card playlistFolder">
            <img src="/fav/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <h5>${response.description}</h5>
            <div  class="play-artist">
              <img class="play-artist-button" src="img/play.svg" alt="">
            </div>
          </div>` 
    }}


// card playlist load when that particular card is clicked

let card = Array.from(document.getElementsByClassName("card" && "playlistFolder"));
card.forEach(async(e) => {
  console.log('a');
  
  e.addEventListener("click", async (item) => {
    
    // document.querySelector(".lib-tag").innerHTML = `${item.currentTarget.dataset.folder}`
    console.log(item.currentTarget.dataset.folder);
    let cardFolder = item.currentTarget.dataset.folder;
    // songs = await getSongs(`songs/${cardFolder}`);
    songs = await getSongs(`fav/${item.currentTarget.dataset.folder}`);
    console.log(`fav/${item.currentTarget.dataset.folder}`);
    
    // console.log(songs);
    
  });
});

return songs

}

async function displayArtistAlbums() {

  console.log(`displaying Albums`); 
  let a = await fetch('/songs/')
  let response = await a.text();
  // console.log(response);
  let div = document.createElement('div')
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
  console.log(array);
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.href.includes('/songs/')) {
      console.log(element);
      let folder = element.href.split('/').slice(-1)[0]
      // console.log(folder);
      // get the metadata of the folder
      let a = await fetch(`songs/${folder}/info.json`)
      let response = await a.json()
      artistCardContainer = document.querySelector(".artistCardContainer")
      artistCardContainer.innerHTML +=  `<div data-folder= "${folder}" class="card artistFolder">
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <h5>${response.description}</h5>
            <div  class="play-artist">
              <img class="play-artist-button" src="img/play.svg" alt="">
            </div>
          </div>`             
    }      
  }
// card playlist load when that particular card is clicked

let card = Array.from(document.getElementsByClassName("card" && "artistFolder"));
card.forEach(async(e) => {
  e.addEventListener("click", async (item) => {
    console.log(item.currentTarget.dataset.folder);
    let cardFolder = item.currentTarget.dataset.folder;
    // songs = await getSongs(`songs/${cardFolder}`);
    console.log(`songs/${item.currentTarget.dataset.folder}`);
    
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    // console.log(songs);
    
  });
});

return songs

}






async function main() {
  // here we gets list of all songs

  await getSongs("songs/arijit");

  // display all the albums on the page
  await displayPlaylistAlbums()
  await displayArtistAlbums();

  

  //  event listener at seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    console.log(percent);
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  

  // display remaining song duration
  currentSong.addEventListener("timeupdate", () => {
    // console.log(document.querySelector(".songTiming"))
    document.querySelector(
      ".songTiming"
    ).innerHTML = `
     ${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}
     `;
     document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    
  });
//  console.log(`${secondsToMinutesSeconds(currentSong.duration - currentSong.currentTime)});
  // play-btn play song prev and next too
  let playBtn = document.querySelector(".playBtn");
  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("playBtn").src = "img/pause.svg";
      document.getElementById("playBtn").style.borderRadius = "25%";
    } else {
      currentSong.pause();
      document.getElementById("playBtn").src = "img/play.svg";
      document.getElementById("playBtn").style.borderRadius = "50%";
    }
  });
  // music hamburger

  let music = document.querySelector(".music");
  music.addEventListener("click", (e) => {
    // document.querySelector(".left").style.left = "0%"
    let value = document.querySelector(".left");
    if (value.style.left != "0%") {
      value.style.left = "0%";
    } else {
      value.style.left = "-100%";
    }
  });

  let close = document.querySelector(".close");
  close.addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-100%";
  });

  // add event listener at next button

  let nextBtn = document.querySelector(".next-btn");
  let prevBtn = document.querySelector(".previous-btn");

  nextBtn.addEventListener("click", () => {
    console.log(currentSong);
    console.log(currentSong.src);
    console.log(currentSong.src.split("/").slice(-1)[0]);
    console.log(songs);
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      track = songs[index + 1].replaceAll("%20", " ").split("by")[0].trim();
      artist = songs[index + 1]
        .replaceAll("%20", " ")
        .split("by")[1]
        .replaceAll(".mp3", "")
        .trim();

      playMusic(track, artist);
    } else {
      track = songs[0].replaceAll("%20", " ").split("by")[0].trim();
      artist = songs[0]
        .replaceAll("%20", " ")
        .split("by")[1]
        .replaceAll(".mp3", "")
        .trim();

      playMusic(track, artist);
    }
  });

  // now for previous

  prevBtn.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      console.log(index - 1, length);
      console.log("prev clicked");

      track = songs[index - 1].replaceAll("%20", " ").split("by")[0].trim();
      artist = songs[index - 1]
        .replaceAll("%20", " ")
        .split("by")[1]
        .replaceAll(".mp3", "")
        .trim();
      console.log(track, artist);
      // console.log("hh");

      playMusic(track, artist);
    } else {
      console.log("hh");

    }
  });
  // volume seekbar
  currentSong.volume = 0.5;
  let volume = document.querySelector("#volume");
  volume.addEventListener("click", (e) => {
    // console.log(e , e.target , e.target.value);
    let newVolume = parseInt(e.target.value) / 100;
    // console.log(newVolume);
    console.log(currentSong.volume);

    currentSong.volume = newVolume;
  });
}
main();
