const screens = Array.from(document.querySelectorAll(".screen"));
const rsvpForm = document.querySelector("#rsvp-form");

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
    if (screen.id === id) {
      screen.scrollTop = 0;
    }
  });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

document.addEventListener("click", (event) => {
  const goButton = event.target.closest("[data-go]");
  if (goButton) {
    showScreen(goButton.dataset.go);
  }
});

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = rsvpForm.querySelector(".rsvp-status");
    status.textContent = "Thank you. Your RSVP has been received.";
    rsvpForm.reset();
  });
}

// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.content-block, .timeline-block, .story-copy p').forEach(el => {
  el.classList.add('fade-up-element');
  observer.observe(el);
});

// Music icon falling animation on scroll
const boardScreen = document.getElementById('board');
const musicIcon = document.querySelector('.falling-music-icon');

if (boardScreen && musicIcon) {
  boardScreen.addEventListener('scroll', () => {
    const scrollY = boardScreen.scrollTop;
    const maxScroll = boardScreen.scrollHeight - boardScreen.clientHeight;
    
    // Calculate scroll percentage (0 to 1)
    let percent = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    // The icon falls from above the screen to slightly below the screen
    const windowHeight = window.innerHeight;
    const targetY = percent * (windowHeight + 100); 
    
    // Add a gentle rotation and slight horizontal sway
    const rotation = percent * 180 - 45; // Rotate from -45deg to 135deg
    const sway = Math.sin(percent * Math.PI * 4) * 20; // Sway left/right by 20px
    
    musicIcon.style.transform = `translate(${sway}px, ${targetY}px) rotate(${rotation}deg)`;
  });
}

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date("July 7, 2026 19:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = distance < 0 ? 0 : Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = distance < 0 ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = distance < 0 ? 0 : Math.floor((distance % (1000 * 60)) / 1000);

  const d = days.toString().padStart(2, '0');
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  // Cover countdown
  const el = (id) => document.getElementById(id);
  if(el("cd-days")) el("cd-days").innerText = d;
  if(el("cd-hours")) el("cd-hours").innerText = h;
  if(el("cd-mins")) el("cd-mins").innerText = m;
  if(el("cd-secs")) el("cd-secs").innerText = s;

  // Board countdown
  if(el("cd-days-b")) el("cd-days-b").innerText = d;
  if(el("cd-hours-b")) el("cd-hours-b").innerText = h;
  if(el("cd-mins-b")) el("cd-mins-b").innerText = m;
  if(el("cd-secs-b")) el("cd-secs-b").innerText = s;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Music Rain Effect
function createMusicRain() {
  const notes = ['♪', '♫', '♬', '♩'];
  const colors = ['#e8a0b0', '#d4a0c0', '#c896b4'];
  const numNotes = 30; // 20-30 notes
  
  for (let i = 0; i < numNotes; i++) {
    const note = document.createElement('div');
    note.className = 'music-rain';
    
    const char = notes[Math.floor(Math.random() * notes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 15) + 14; 
    const left = Math.random() * 100; 
    const fallDuration = Math.random() * 6 + 4; 
    const driftDuration = Math.random() * 2 + 2; 
    // Negative delay so they are already scattered on screen at load
    const delay = -(Math.random() * 15); 
    const opacity = Math.random() * 0.3 + 0.3; 
    
    note.textContent = char;
    note.style.color = color;
    note.style.fontSize = size + 'px';
    note.style.left = left + 'vw';
    note.style.setProperty('--max-opacity', opacity);
    
    note.style.animationDuration = fallDuration + 's, ' + driftDuration + 's';
    note.style.animationDelay = delay + 's, 0s';
    
    document.body.appendChild(note);
  }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createMusicRain);
} else {
    createMusicRain();
}

// Background Music Logic
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let isMusicPlaying = false;

function toggleMusic() {
  if (!bgMusic) return;
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
    if(musicToggle) musicToggle.classList.remove("playing");
  } else {
    bgMusic.play().catch(e => console.log("Audio play failed:", e));
    isMusicPlaying = true;
    if(musicToggle) musicToggle.classList.add("playing");
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

// Auto-play music when user first interacts with the 'Tap to open' button
document.addEventListener("click", (event) => {
  const goButton = event.target.closest("[data-go]");
  if (goButton && goButton.dataset.go === "board" && !isMusicPlaying) {
    // Slight delay to sync with screen transition
    setTimeout(toggleMusic, 300);
  }
});
