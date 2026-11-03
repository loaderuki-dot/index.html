"use strict";

const $ = id => document.getElementById(id);

function node(tag, text, className) {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
}

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    $("storageStatus").textContent =
      "Saqlashga ruxsat yo‘q. Belgilar sahifa yopilguncha qoladi.";
  }
}

const lessons = [
  {
    id: "o6aucC8_ot8",
    key: "one",
    title: "IT bilan tanishuv",
    category: "intro",
    description: "Avval tanlagan videong bilan o‘rganishni boshla.",
    task: "Videodan uchta yangi tushunchani yozib ol."
  },
  {
    id: "0NdDKClb1eQ",
    key: "two",
    title: "Dasturlash nima? — Texnoplov",
    category: "coding",
    description: "Dasturlash olami bilan tanishuv.",
    task: "O‘zing yaratishni xohlagan bitta dastur g‘oyasini yoz."
  },
  {
    id: "c6gdO6mwg8w",
    key: "translated-computer",
    title: "Kompyuter qanday ishlaydi?",
    category: "computer",
    description: "Branch Education videosining o‘zbekcha tarjimasi.",
    task: "Protsessor, xotira va disk vazifalarini o‘z so‘zing bilan yoz."
  },
  {
    id: "TB-y_Twwv9c",
    key: "translated-khan",
    title: "Kompyuterlar qanday ishlaydi?",
    category: "computer",
    description: "Khan Academy Uzbek tayyorlagan qisqa video.",
    task: "Kompyuterga kiradigan va undan chiqadigan ma’lumotga misol top."
  }
];

const music = [
  {
    id: "ZlS5VDLuGbs",
    title: "Interstellar — Where We’re Going",
    description: "Uzun takroriy versiya."
  },
  {
    id: "enYduGdGzjA",
    title: "Nuages — Closer",
    description: "1 soatlik slowed + reverb versiyasi."
  },
  {
    id: "zMMuayoF_o4",
    title: "Idea 22 — Cello & Piano",
    description: "Sekinlashtirilgan violonchel va pianino."
  }
];

const stored = read("nexorya-completed-v2", []);
const completed = new Set(
  Array.isArray(stored)
    ? stored.filter(key => lessons.some(item => item.key === key))
    : []
);

function updateProgress() {
  $("progress").textContent =
    "Belgilangan materiallar: " + completed.size + " / " + lessons.length;
}

function makeCard(item, track) {
  const card = node("article", undefined, "card");
  const player = node("div", undefined, "player");
  const play = node("button", "▶ Pleerni ochish", "play-button");
  play.type = "button";

  play.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube.com/embed/" + item.id;
    frame.title = item.title;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    player.replaceChildren(frame);
  }, { once: true });

  player.append(play);

  const info = node("div", undefined, "pad");
  info.append(
    node("h3", item.title),
    node("p", item.description)
  );

  if (item.task) {
    info.append(node("p", "Mashq: " + item.task, "task"));
  }

  const actions = node("div", undefined, "actions");
  const link = node("a", "YouTube’da ochish ↗");
  link.href = "https://www.youtube.com/watch?v=" + item.id;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  actions.append(link);

  if (track) {
    const button = node("button");
    button.type = "button";

    function updateButton() {
      const done = completed.has(item.key);
      button.textContent = done
        ? "✓ Ko‘rilgan · bekor qilish"
        : "Ko‘rdim deb belgilash";
      button.setAttribute("aria-pressed", String(done));
    }

    button.addEventListener("click", () => {
      if (completed.has(item.key)) completed.delete(item.key);
      else completed.add(item.key);

      save("nexorya-completed-v2", [...completed]);
      updateButton();
      updateProgress();
    });

    updateButton();
    actions.append(button);
  }

  info.append(actions);
  card.append(player, info);
  return card;
}

function renderLessons() {
  const query = $("search").value.trim().toLocaleLowerCase();
  const category = $("category").value;

  const selected = lessons.filter(item => {
    const text = (item.title + " " + item.description).toLocaleLowerCase();
    return text.includes(query) &&
      (category === "all" || category === item.category);
  });

  $("lessonGrid").replaceChildren(
    ...selected.map(item => makeCard(item, true))
  );
  $("noResults").hidden = selected.length > 0;
}

$("search").addEventListener("input", renderLessons);
$("category").addEventListener("change", renderLessons);

renderLessons();
updateProgress();

music.forEach(item => $("musicGrid").append(makeCard(item, false)));

const questions = [
  {
    question: "HTML asosan nima uchun ishlatiladi?",
    options: ["Sahifa tuzilishini yaratish", "Kompyuterni sovitish", "Parolni yashirish"],
    answer: 0
  },
  {
    question: "CSS nimani boshqaradi?",
    options: ["Internet tezligini", "Sahifaning dizaynini", "Disk hajmini"],
    answer: 1
  },
  {
    question: "JavaScript saytga nima qo‘sha oladi?",
    options: ["Faqat rasmlar", "Faqat domen", "Interaktiv harakatlar"],
    answer: 2
  },
  {
    question: "Protsessorning asosiy vazifasi nima?",
    options: ["Faqat ovoz chiqarish", "Ko‘rsatmalarni bajarish", "Faqat fayl saqlash"],
    answer: 1
  },
  {
    question: "Qaysi parol odatda yaxshiroq tanlov?",
    options: ["123456", "Isming va tug‘ilgan yiling", "Uzun, noyob va taxmin qilish qiyin parol"],
    answer: 2
  }
];

questions.forEach((item, index) => {
  const field = document.createElement("fieldset");
  field.append(node("legend", (index + 1) + ". " + item.question));

  item.options.forEach((text, optionIndex) => {
    const label = node("label", undefined, "answer");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "question" + index;
    radio.value = String(optionIndex);
    radio.required = true;
    label.append(radio, document.createTextNode(text));
    field.append(label);
  });

  $("questions").append(field);
});

$("quizForm").addEventListener("submit", event => {
  event.preventDefault();
  const answers = new FormData(event.currentTarget);
  let score = 0;
  const review = [];

  questions.forEach((item, index) => {
    if (Number(answers.get("question" + index)) === item.answer) {
      score++;
    } else {
      review.push(
        (index + 1) + "-savol: " + item.options[item.answer]
      );
    }
  });

  $("quizResult").textContent =
    "Natija: " + score + " / " + questions.length +
    (review.length
      ? "\nTo‘g‘ri javoblar:\n" + review.join("\n")
      : "\nAjoyib! Barcha javoblar to‘g‘ri.");
});

$("quizForm").addEventListener("reset", () => {
  $("quizResult").textContent = "";
});

const quotes = [
  "Kayfiyatni kutma. Birinchi kichik qadamni tashla.",
  "Bugungi kichik harakat — ertangi o‘zingga sovg‘a.",
  "Mukammal boshlash shart emas. Davom etish muhim.",
  "Boshqalar bilan emas, kechagi o‘zing bilan solishtir.",
  "Bitta dars. Bitta mashq. Yana bir qadam."
];

let quoteIndex = 0;

$("nextQuote").addEventListener("click", () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  $("quote").textContent = quotes[quoteIndex];
});

function today() {
  const date = new Date();
  return date.getFullYear() + "-" +
    (date.getMonth() + 1) + "-" + date.getDate();
}

let taskDay = today();
const taskBoxes = [...document.querySelectorAll("[data-task]")];

function loadTasks() {
  let tasks = read("nexorya-tasks-" + taskDay, {});
  if (!tasks || typeof tasks !== "object") tasks = {};

  taskBoxes.forEach(box => {
    box.checked = tasks[box.dataset.task] === true;
  });
}

taskBoxes.forEach(box => {
  box.addEventListener("change", () => {
    if (today() !== taskDay) {
      taskDay = today();
      loadTasks();
      return;
    }

    const tasks = {};
    taskBoxes.forEach(input => {
      tasks[input.dataset.task] = input.checked;
    });
    save("nexorya-tasks-" + taskDay, tasks);
  });
});

window.addEventListener("focus", () => {
  if (today() !== taskDay) {
    taskDay = today();
    loadTasks();
  }
});

loadTasks();

let duration = 1500;
let remaining = duration;
let deadline = 0;
let interval = null;

function drawTimer() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  $("clock").textContent = minutes + ":" + seconds;
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
}

function tick() {
  remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  drawTimer();

  if (remaining === 0) {
    stopTimer();
    $("startTimer").textContent = "Qayta boshlash";
    $("timerStatus").textContent = "Vaqt tugadi! Keyingi qadamni tanla.";
  }
}

$("startTimer").addEventListener("click", () => {
  if (interval !== null) {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    stopTimer();
    drawTimer();
    $("startTimer").textContent = "Davom etish";
    $("timerStatus").textContent = "Taymer pauzada.";
    return;
  }

  if (remaining === 0) remaining = duration;
  deadline = Date.now() + remaining * 1000;
  interval = setInterval(tick, 250);
  $("startTimer").textContent = "Pauza";
  $("timerStatus").textContent = "Taymer ishlayapti.";
  tick();
});

function resetTimer() {
  stopTimer();
  remaining = duration;
  drawTimer();
  $("startTimer").textContent = "Boshlash";
  $("timerStatus").textContent = "Tayyormisan?";
}

$("resetTimer").addEventListener("click", resetTimer);

document.querySelectorAll("[data-minutes]").forEach(button => {
  button.addEventListener("click", () => {
    duration = Number(button.dataset.minutes) * 60;
    resetTimer();
  });
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && interval !== null) tick();
});

drawTimer();
$("year").textContent = new Date().getFullYear();