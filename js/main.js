// Back to top
const btn = document.createElement("button");
btn.id = "backToTop";
btn.className = "backToTop";
btn.innerHTML = "⬆️";
document.body.appendChild(btn);

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    backToTop.classList.remove("show");
});

const tabs = $$(".tab-item");

const tabActive = $(".tab-item.active");
const line = $(".tabs .line");

// -------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // === 1️⃣ Tự thêm data-link cho các tab (dựa theo thứ tự) ===
    const tabPaths = [
        "index.html", // 0: Home
        "about.html", // 1: About
        "location.html", // 2: Location
        "blog.html", // 3: Blog
        "contact.html", // 4: Contact
    ];
    tabs.forEach((tab, i) => {
        if (!tab.dataset.link && tabPaths[i]) {
            tab.dataset.link = tabPaths[i];
        }
    });

    // === 2️⃣ Lấy file hiện tại (dạng tương đối) ===
    const currentFile = location.pathname.split("/").pop() || "index.html";

    // === 3️⃣ Gom nhóm các trang con của Location ===
    const locationGroup = [
        "haiphong.html",
        "daklak.html",
        "hue.html",
        "china.html",
        "vungtau.html",
        "hatinh.html",
    ];

    // === 4️⃣ Định nghĩa map cho các tab chính ===
    const pathMap = {
        "index.html": 0,
        "about.html": 1,
        "location.html": 2,
        "blog.html": 3,
        "contact.html": 4,
    };

    // === 5️⃣ Xác định tab active dựa theo URL hoặc localStorage ===
    let activeIndex = 0; // mặc định Home

    if (locationGroup.includes(currentFile)) {
        activeIndex = 2; // nhóm Location
    } else if (pathMap[currentFile] !== undefined) {
        activeIndex = pathMap[currentFile];
    } else {
        const saved = localStorage.getItem("activeIndex");
        if (saved !== null && !isNaN(saved)) {
            const idx = Number(saved);
            if (idx >= 0 && idx < tabs.length) {
                activeIndex = idx;
            }
        }
    }

    // === 6️⃣ Active tab và cập nhật line ===
    const prevActive = document.querySelector(".tab-item.active");
    if (prevActive) prevActive.classList.remove("active");

    const targetTab = tabs[activeIndex] || tabs[0];
    targetTab.classList.add("active");

    requestAnimationFrame(() => {
        line.style.left = targetTab.offsetLeft + "px";
        line.style.width = targetTab.offsetWidth + "px";
    });

    // === 7️⃣ Khi click tab ===
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            document
                .querySelector(".tab-item.active")
                ?.classList.remove("active");
            tab.classList.add("active");

            line.style.left = tab.offsetLeft + "px";
            line.style.width = tab.offsetWidth + "px";

            localStorage.setItem(
                "lineActive",
                JSON.stringify({
                    left: tab.offsetLeft + "px",
                    width: tab.offsetWidth + "px",
                })
            );
            localStorage.setItem("activeIndex", index);

            // Chuyển trang theo data-link (tương đối)
            const href = tab.dataset.link;
            if (href) window.location.href = href;
        });
    });

    // === 8️⃣ Khi click link trong nội dung ===
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        // Lấy tên file cuối cùng (chuẩn hoá tương đối)
        const absoluteURL = new URL(link.getAttribute("href"), location.origin);
        const targetFile = absoluteURL.pathname.split("/").pop();

        if (locationGroup.includes(targetFile)) {
            localStorage.setItem("activeIndex", 2);
        } else if (pathMap[targetFile] !== undefined) {
            localStorage.setItem("activeIndex", pathMap[targetFile]);
        }
    });
});

// Handle Like
const likeBoxes = document.querySelectorAll(".blog-item__like");

likeBoxes.forEach((likeBox, index) => {
    const likeIcon = likeBox.querySelector(".blog-item__like--icon");
    const key = `liked-${index}`;

    let liked = localStorage.getItem(key) === "true";

    if (liked) {
        likeBox.classList.add("liked");
        likeIcon.classList.add("liked");
        likeIcon.src = "./assets/icon/heart-filled.svg";
    }

    likeBox.addEventListener("click", () => {
        liked = !liked;

        if (liked) {
            likeBox.classList.add("liked");
            likeIcon.classList.add("liked");
            likeIcon.src = "./assets/icon/heart-filled.svg";
        } else {
            likeBox.classList.remove("liked");
            likeIcon.classList.remove("liked");
            likeIcon.src = "./assets/icon/like.svg";
        }

        localStorage.setItem(key, liked);
    });
});
