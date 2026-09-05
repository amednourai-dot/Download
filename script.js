const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");
const pageButtons = document.querySelectorAll("[data-page]");

const videoUrl = document.getElementById("videoUrl");
const pasteBtn = document.getElementById("pasteBtn");
const clearBtn = document.getElementById("clearBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const message = document.getElementById("message");
const resultBox = document.getElementById("resultBox");
const videoTitle = document.getElementById("videoTitle");
const videoSource = document.getElementById("videoSource");
const downloadBtn = document.getElementById("downloadBtn");

const themeBtn = document.getElementById("themeBtn");
const themeSettingBtn = document.getElementById("themeSettingBtn");
const languageBtn = document.getElementById("languageBtn");
const installBtn = document.getElementById("installBtn");

const toast = document.getElementById("toast");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const analysisCount = document.getElementById("analysisCount");
const historyCount = document.getElementById("historyCount");

let selectedFormat = "MP4";
let selectedQuality = "1080p";
let deferredPrompt = null;

function showPage(pageId) {
pages.forEach(page => {
page.classList.remove("active");
});

document.getElementById(pageId).classList.add("active");

navButtons.forEach(button => {
    button.classList.toggle(
        "active",
        button.dataset.page === pageId
    );
});

if (pageId === "homePage") {
    updateStats();
}

}

pageButtons.forEach(button => {
button.addEventListener("click", () => {
showPage(button.dataset.page);
});
});

function showToast(text) {
toast.textContent = text;
toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
}, 2500);

}

function isValidUrl(url) {
try {
const parsed = new URL(url);

    return (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
    );
} catch {
    return false;
}

}

pasteBtn.addEventListener("click", async () => {
try {
const text = await navigator.clipboard.readText();

    if (text) {
        videoUrl.value = text;
        showToast("تم لصق الرابط");
    } else {
        showToast("الحافظة فارغة");
    }
} catch {
    showToast("تعذر الوصول إلى الحافظة");
}

});

clearBtn.addEventListener("click", () => {
videoUrl.value = "";
message.textContent = "";
resultBox.classList.add("hidden");
videoUrl.focus();
});

analyzeBtn.addEventListener("click", () => {
const url = videoUrl.value.trim();

message.textContent = "";

if (!url) {
    message.textContent = "أدخل رابطًا أولاً.";
    return;
}

if (!isValidUrl(url)) {
    message.textContent = "الرابط غير صحيح.";
    return;
}

loading.classList.remove("hidden");
analyzeBtn.disabled = true;

setTimeout(() => {
    const parsedUrl = new URL(url);

    videoSource.textContent = parsedUrl.hostname.replace("www.", "");
    videoTitle.textContent = "فيديو تجريبي من الرابط المدخل";

    resultBox.classList.remove("hidden");

    loading.classList.add("hidden");
    analyzeBtn.disabled = false;

    saveHistory(url);
    increaseAnalysisCount();

    showToast("تم تحليل الرابط بنجاح");
}, 1500);

});

document.querySelectorAll(".format-btn").forEach(button => {
button.addEventListener("click", () => {
document.querySelectorAll(".format-btn").forEach(btn => {
btn.classList.remove("active");
});

    button.classList.add("active");
    selectedFormat = button.dataset.format;
});

});

document.querySelectorAll(".quality-btn").forEach(button => {
button.addEventListener("click", () => {
document.querySelectorAll(".quality-btn").forEach(btn => {
btn.classList.remove("active");
});

    button.classList.add("active");
    selectedQuality = button.dataset.quality;
});

});

downloadBtn.addEventListener("click", () => {
showToast(
"واجهة تجريبية: ${selectedFormat} - ${selectedQuality}"
);
});

function toggleTheme() {
document.body.classList.toggle("dark");

const isDark = document.body.classList.contains("dark");

themeBtn.textContent = isDark ? "☀️" : "🌙";

localStorage.setItem(
    "vdTheme",
    isDark ? "dark" : "light"
);

}

themeBtn.addEventListener("click", toggleTheme);
themeSettingBtn.addEventListener("click", toggleTheme);

function loadTheme() {
if (localStorage.getItem("vdTheme") === "dark") {
document.body.classList.add("dark");
themeBtn.textContent = "☀️";
}
}

function getHistory() {
return JSON.parse(
localStorage.getItem("vdHistory")
) || [];
}

function saveHistory(url) {
let history = getHistory();

history = history.filter(item => item.url !== url);

history.unshift({
    url: url,
    time: new Date().toLocaleString("ar")
});

history = history.slice(0, 10);

localStorage.setItem(
    "vdHistory",
    JSON.stringify(history)
);

renderHistory();
updateStats();

}

function renderHistory() {
const history = getHistory();

if (!history.length) {
    historyList.innerHTML = `
        <div class="empty">
            📭
            <br><br>
            لا يوجد سجل حتى الآن
        </div>
    `;
    return;
}

historyList.innerHTML = "";

history.forEach(item => {
    const element = document.createElement("div");

    element.className = "history-item";

    const url = document.createElement("div");
    url.className = "history-url";
    url.textContent = item.url;

    const time = document.createElement("div");
    time.className = "history-time";
    time.textContent = item.time;

    element.appendChild(url);
    element.appendChild(time);

    element.addEventListener("click", () => {
        videoUrl.value = item.url;
        showPage("downloadPage");
        showToast("تم استعادة الرابط");
    });

    historyList.appendChild(element);
});

}

clearHistoryBtn.addEventListener("click", () => {
localStorage.removeItem("vdHistory");
renderHistory();
updateStats();
showToast("تم مسح السجل");
});

function increaseAnalysisCount() {
let count = Number(
localStorage.getItem("vdAnalysisCount")
) || 0;

count++;

localStorage.setItem(
    "vdAnalysisCount",
    count
);

updateStats();

}

function updateStats() {
const count = Number(
localStorage.getItem("vdAnalysisCount")
) || 0;

analysisCount.textContent = count;
historyCount.textContent = getHistory().length;

}

languageBtn.addEventListener("click", () => {
showToast("ميزة تغيير اللغة ستكون متاحة في تحديث لاحق");
});

window.addEventListener("beforeinstallprompt", event => {
event.preventDefault();

deferredPrompt = event;

installBtn.classList.remove("hidden");

});

installBtn.addEventListener("click", async () => {
if (!deferredPrompt) {
showToast("التثبيت غير متاح حاليًا");
return;
}

deferredPrompt.prompt();

await deferredPrompt.userChoice;

deferredPrompt = null;

installBtn.classList.add("hidden");

});

if ("serviceWorker" in navigator) {
window.addEventListener("load", () => {
navigator.serviceWorker.register("sw.js");
});
}

loadTheme();
renderHistory();
updateStats();
