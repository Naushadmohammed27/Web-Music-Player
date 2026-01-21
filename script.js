const audio = document.getElementById("audio");

const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const playlistEl = document.getElementById("playlist");

const volumeSlider = document.getElementById("volume");
const muteBtn = document.getElementById("mute");

// ✅ Song Data (Change title/artist if you want)
const songs = [
  { title: "A New Start", artist: "Unknown Artist", src: "songs/song1.mp3", duration: "3:20" },
  { title: "Dream Vibes", artist: "DJ Sample", src: "songs/song2.mp3", duration: "2:58" },
  { title: "Night Beats", artist: "Music Maker", src: "songs/song3.mp3", duration: "4:10" }
];

let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;

// ✅ Load Song
function loadSong(index){
  const song = songs[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audio.src = song.src;

  updatePlaylistActive(index);
}

// ✅ Play Song
function playSong(){
  isPlaying = true;
  audio.play();
  playBtn.textContent = "⏸";
}

// ✅ Pause Song
function pauseSong(){
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "▶";
}

// ✅ Toggle Play/Pause
playBtn.addEventListener("click", () => {
  if(isPlaying){
    pauseSong();
  } else {
    playSong();
  }
});

// ✅ Next Song
function nextSong(){
  currentSongIndex++;
  if(currentSongIndex >= songs.length) currentSongIndex = 0;
  loadSong(currentSongIndex);
  playSong();
}

// ✅ Previous Song
function prevSong(){
  currentSongIndex--;
  if(currentSongIndex < 0) currentSongIndex = songs.length - 1;
  loadSong(currentSongIndex);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// ✅ Update Progress Bar + Time
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;

  if(duration){
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
  }
});

// ✅ Seek (Click on Progress Bar)
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// ✅ Auto Next When Song Ends
audio.addEventListener("ended", nextSong);

// ✅ Volume Control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;

  if(audio.volume == 0){
    muteBtn.textContent = "🔇";
  } else {
    muteBtn.textContent = "🔊";
    isMuted = false;
  }
});

// ✅ Mute / Unmute
muteBtn.addEventListener("click", () => {
  if(!isMuted){
    audio.volume = 0;
    volumeSlider.value = 0;
    muteBtn.textContent = "🔇";
    isMuted = true;
  } else {
    audio.volume = 1;
    volumeSlider.value = 1;
    muteBtn.textContent = "🔊";
    isMuted = false;
  }
});

// ✅ Convert seconds -> mm:ss
function formatTime(time){
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// ✅ Render Playlist
function renderPlaylist(){
  playlistEl.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${song.title} - ${song.artist}</span>
      <span>${song.duration}</span>
    `;

    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });

    playlistEl.appendChild(li);
  });
}

// ✅ Highlight Active Song
function updatePlaylistActive(index){
  const items = document.querySelectorAll("#playlist li");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

// ✅ Start App
renderPlaylist();
loadSong(currentSongIndex);
