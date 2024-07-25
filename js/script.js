let music = document.querySelector(".audio_");

let play = document.querySelector(".play i");
let playNext = document.querySelector(".next i");
let playPrev = document.querySelector(".prev i");
let imageId = document.getElementById("imageId");

let titleTextdata = document.querySelector(".titleTextdata marquee");
let artistNameData = document.querySelector(".text p");
let albumNameData = document.querySelector(".text small");
let repeatBtn = document.querySelector(".repeat i");
let likeBtn = document.querySelector(".like i");

let played = false;
let songIndex = 0;

let isRepeat = false;

function playmusicFunction() {
  music.play();
  played = true;
  play.classList.replace("fa-play-circle", "fa-pause");
  imageId.classList.add("imageRotate");
}
function pausemusicFunction() {
  music.pause();
  played = false;
  play.classList.replace("fa-pause", "fa-play-circle");
  imageId.classList.remove("imageRotate");
}
function playMusic() {
  if (played) {
    pausemusicFunction();
  } else {
    playmusicFunction();
  }
}
play.addEventListener("click", playMusic);

function loadData(songs) {
  artistNameData.textContent = `${songs.artistName}`;
  titleTextdata.textContent = `${songs.title}`;
  albumNameData.textContent = `${songs.albumName}`;
  music.src = `music/${songs.name}.mp3`;
  imageId.src = `assets/${songs.name}.png`;
}

function nextMusicFunction() {
  songIndex = (songIndex + 1) % songs.length;
  loadData(songs[songIndex]);

  playmusicFunction();
}
playNext.addEventListener("click", nextMusicFunction);
function prevMusicFunction() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadData(songs[songIndex]);

  playmusicFunction();
}
playPrev.addEventListener("click", prevMusicFunction);

let progressLine = document.querySelector(".progressLine");
let progressBar = document.querySelector(".progressBar");

let currentTimeText = document.querySelector(".currentTime");
durationDataText = document.querySelector(".duration");

function updateTimeFunction(e) {
  console.log(e);
  let { currentTime, duration } = e.srcElement;
  // other option
  //  let { currentTime, duration } = e.target;
  let currentMusicData = (currentTime / duration) * 100;
  progressLine.style.width = `${currentMusicData}%`;

  let curM = Math.floor(currentTime / 60);
  let curS = Math.floor(currentTime % 60);

  if (curS < 10) {
    curS = `0${curS}`;
  }

  if (curM < 10) {
    curM = `0${curM}`;
  }
  currentTimeText.textContent = `${curM}:${curS}`;

  let remainingTime = duration - currentTime;
  let durM = Math.floor(remainingTime / 60);
  let durS = Math.floor(remainingTime % 60);

  if (durS < 10) {
    durS = `0${durS}`;
  }

  if (durM < 10) {
    durM = `0${durM}`;
  }
  if (duration) {
    durationDataText.textContent = `-${durM}:${durS}`;
  }
}
music.addEventListener("timeupdate", updateTimeFunction);

VanillaTilt.init(document.querySelector(".player"), {
  max: 25,
  speed: 400,
});

//It also supports NodeList
VanillaTilt.init(document.querySelectorAll(".player"));

function progressBarFunction(e) {
  let { duration } = music;
  let progress = (e.offsetX / e.srcElement.clientWidth) * duration;

  music.currentTime = progress;
}
progressBar.addEventListener("click", progressBarFunction);

function repeatMusicFunction() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("repeatMode");
}

music.addEventListener("ended", () => {
  if (isRepeat) {
    playmusicFunction();
  } else {
    nextMusicFunction();
  }
});

repeatBtn.addEventListener("click", repeatMusicFunction);

function likedmusicFunction() {
  likeBtn.classList.toggle("likedMode");
}

likeBtn.addEventListener("click", likedmusicFunction);
