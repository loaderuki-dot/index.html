// Navigation & Sidebar
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(item => item.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
        
        link.classList.add('active');
        const target = document.getElementById(link.getAttribute('data-target'));
        target.classList.add('active');
    });
});

// Mock Database
const lessonsData = [
    { id: 1, title: "Zamonaviy HTML va CSS asoslari", category: "frontend", desc: "Noldan boshlab professional veb-sayt yaratish.", img: "https://picsum.photos/300/200?random=1", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "UI/UX Dizayn Tamoyillari", category: "design", desc: "Figma dasturida mukammal interfeyslar yaratish.", img: "https://picsum.photos/300/200?random=2", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 3, title: "Sun'iy Intellekt va Prompt Engineering", category: "ai", desc: "ChatGPT va neyrotarmoqlar bilan ishlash sirlari.", img: "https://picsum.photos/300/200?random=3", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, title: "JavaScript ES6+ ilg'or usullar", category: "frontend", desc: "Dinamik va interaktiv veb ilovalar yasash.", img: "https://picsum.photos/300/200?random=4", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
];

const galleryData = [
    { title: "Futuristik Shahar", img: "https://picsum.photos/300/200?random=10" },
    { title: "Kiberpank Mavzu", img: "https://picsum.photos/300/200?random=11" },
    { title: "Abstrakt Texnologiya", img: "https://picsum.photos/300/200?random=12" },
    { title: "Minimalistik Ishxona", img: "https://picsum.photos/300/200?random=13" }
];

const videosData = [
    { title: "Nexorya Promo Video", desc: "Platformaning asosiy imkoniyatlari", img: "https://picsum.photos/300/200?random=20", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Kreativ Fokus Sirlari", desc: "Diqqatni jamlash bo'yicha maslahatlar", img: "https://picsum.photos/300/200?random=21", video: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
];

const wikiData = [
    { title: "Glassmorphism", desc: "Shaffof oyna effekti yaratishga asoslangan zamonaviy dizayn uslubi." },
    { title: "API (Application Programming Interface)", desc: "Turli xil dasturiy ta'minot tizimlarining o'zaro muloqot qilish vositasi." },
    { title: "Pomodoro Texnikasi", desc: "Vaqtni boshqarish usuli: 25 daqiqa ish, 5 daqiqa dam olish." }
];

// Render Lessons
const lessonsGrid = document.getElementById('lessonsGrid');
function renderLessons(filter = 'all') {
    lessonsGrid.innerHTML = '';
    const filtered = filter === 'all' ? lessonsData : lessonsData.filter(l => l.category === filter);
    
    filtered.forEach(lesson => {
        lessonsGrid.innerHTML += `
            <div class="glass-card" onclick="openVideo('${lesson.video}')">
                <img src="${lesson.img}" class="card-img" alt="">
                <div class="card-body">
                    <h4>${lesson.title}</h4>
                    <p>${lesson.desc}</p>
                    <button class="btn primary">Ko'rish</button>
                </div>
            </div>
        `;
    });
}
renderLessons();

// Filter Event
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderLessons(e.target.getAttribute('data-filter'));
    });
});

// Gallery Render
const galleryGrid = document.getElementById('galleryGrid');
galleryData.forEach(item => {
    galleryGrid.innerHTML += `
        <div class="glass-card">
            <img src="${item.img}" class="card-img" alt="">
            <div class="card-body">
                <h4>${item.title}</h4>
            </div>
        </div>
    `;
});

// Videos Render
const videosGrid = document.getElementById('videosGrid');
videosData.forEach(item => {
    videosGrid.innerHTML += `
        <div class="glass-card" onclick="openVideo('${item.video}')">
            <img src="${item.img}" class="card-img" alt="">
            <div class="card-body">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </div>
        </div>
    `;
});

// Wiki Render
const wikiGrid = document.getElementById('wikiGrid');
function renderWiki(query = '') {
    wikiGrid.innerHTML = '';
    const filtered = wikiData.filter(w => w.title.toLowerCase().includes(query.toLowerCase()) || w.desc.toLowerCase().includes(query.toLowerCase()));
    
    filtered.forEach(item => {
        wikiGrid.innerHTML += `
            <div class="glass-card">
                <div class="card-body">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
    });
}
renderWiki();

document.getElementById('wikiSearchInput').addEventListener('input', (e) => {
    renderWiki(e.target.value);
});

// Modal Logic
const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');
const closeModal = document.querySelector('.close-modal');

function openVideo(url) {
    modalIframe.src = url;
    modal.style.display = 'flex';
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalIframe.src = '';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalIframe.src = '';
    }
});

// Pomodoro Timer Logic
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
const timerDisplay = document.getElementById('timerDisplay');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('startTimer').addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                alert("Vaqt tugadi! Dam oling.");
            }
        }, 1000);
    }
});

document.getElementById('pauseTimer').addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
});

document.getElementById('resetTimer').addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// Ideas Board Logic
const ideaInput = document.getElementById('ideaInput');
const ideasList = document.getElementById('ideasList');
let ideas = JSON.parse(localStorage.getItem('nexorya_ideas')) || [];

function renderIdeas() {
    ideasList.innerHTML = '';
    ideas.forEach((idea, index) => {
        ideasList.innerHTML += `
            <li>
                <span>${idea}</span>
                <button class="btn danger" onclick="deleteIdea(${index})"><i class="fa-solid fa-trash"></i></button>
            </li>
        `;
    });
}

document.getElementById('addIdeaBtn').addEventListener('click', () => {
    if (ideaInput.value.trim() !== '') {
        ideas.push(ideaInput.value.trim());
        localStorage.setItem('nexorya_ideas', JSON.stringify(ideas));
        ideaInput.value = '';
        renderIdeas();
    }
});

function deleteIdea(index) {
    ideas.splice(index, 1);
    localStorage.setItem('nexorya_ideas', JSON.stringify(ideas));
    renderIdeas();
}
renderIdeas();

// Global Search
document.getElementById('globalSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    // Oddiy qidiruv logikasini shu yerda kengaytirishingiz mumkin
});