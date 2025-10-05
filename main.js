// DOM Elements
const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const customProgressBar = document.getElementById("custom-progress-bar");
const rateDisplay = document.getElementById("rateDisplay");
const albumArt = document.getElementById("albumArt");

const songsURL = "./songs/";
const artURL = "./albumArt/";

const songs = [
  { file: "Aidan.mp3", albumArt: "Aidan.jpg" },
  { file: "autumn_sun.mp3", albumArt: "BestPart.jpg" },
];

let currentTrack = 0;
let playbackInterval = null;

function loadTrack(index) {
  const song = songs[index];
  audioPlayer.src = `${songsURL}${song.file}`;
  albumArt.src = `${artURL}${song.albumArt}`;
  audioPlayer.playbackRate = 1.0;
  rateDisplay.textContent = "1.00x";
}

function playTrack() {
  if (!audioPlayer.src) loadTrack(currentTrack);
  audioPlayer.play();
  playButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");

  clearInterval(playbackInterval);
  playbackInterval = setInterval(() => {
    if (!audioPlayer.paused && audioPlayer.playbackRate < 1.5) {
      audioPlayer.playbackRate += 0.005;
      rateDisplay.textContent = `${audioPlayer.playbackRate.toFixed(2)}x`;
    }
  }, 1000);
}

function pauseTrack() {
  audioPlayer.pause();
  playButton.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  clearInterval(playbackInterval);
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % songs.length;
  loadTrack(currentTrack);
  playTrack();
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + songs.length) % songs.length;
  loadTrack(currentTrack);
  playTrack();
}

audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    customProgressBar.style.width = `${progress}%`;
  }
});

audioPlayer.addEventListener("ended", nextTrack);

playButton.addEventListener("click", playTrack);
pauseButton.addEventListener("click", pauseTrack);
nextButton.addEventListener("click", nextTrack);
prevButton.addEventListener("click", prevTrack);

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case " ":
      event.preventDefault();
      audioPlayer.paused ? playTrack() : pauseTrack();
      break;
    case "m":
    case "M":
      audioPlayer.muted = !audioPlayer.muted;
      break;
    case "ArrowRight":
      audioPlayer.currentTime = Math.min(
        audioPlayer.currentTime + 10,
        audioPlayer.duration
      );
      break;
    case "ArrowLeft":
      audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 10, 0);
      break;
  }
});

albumArt.onerror = () => {
  albumArt.src = "https://via.placeholder.com/300x300.png?text=Album+Art";
};
