const videoUrl = document.getElementById("videoUrl");
const pasteBtn = document.getElementById("pasteBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultSection = document.getElementById("resultSection");
const message = document.getElementById("message");
const themeBtn = document.getElementById("themeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const toast = document.getElementById("toast");
const videoTitle = document.getElementById("videoTitle");
const videoSource = document.getElementById("videoSource");

pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();

        if (text) {
            videoUrl.value = text;
            showToast("تم لصق الرابط بنجاح");
        } else {
            showToast("الحافظة فارغة");
        }
    } catch {
        showToast("تعذر الوصول إلى الحافظة");
    }
});

analyzeBtn.addEventListener("click", () => {
    const url = videoUrl.value.trim();

    if (!url) {
        message.textContent = "الرجاء إدخال رابط الفيديو أولاً.";
        return;
    }

    if (!isValidUrl(url)) {
        message.textContent = "الرجاء إدخال رابط صحيح.";
        return;
    }

    message.textContent = "جاري تحليل الرابط...";

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "⏳ جاري التحليل...";

    setTimeout(() => {
        message.textContent = "";

        const hostname = new URL(url).hostname.replace("www.", "");

        videoTitle.textContent = "فيديو تجريبي من الرابط الذي أدخلته";
        videoSource.textContent = hostname;

        resultSection.classList.remove("hidden");

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = "<span>🔍</span> تحليل الرابط";

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        showToast("تم تحليل الرابط بنجاح");
    }, 1500);
});

downloadBtn.addEventListener("click", () => {
    showToast("هذه نسخة تجريبية، التنزيل غير متاح حاليًا.");
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "light");
    }
});

function isValidUrl(value) {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "🌙";
  }
