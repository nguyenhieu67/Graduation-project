// Handle back to top
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
const menus = $$(".tab-item .menu__item");

// -------------------------------------------------
// Handle active line
// document.addEventListener("DOMContentLoaded", () => {
//     const tabPaths = [
//         "index.html", // 0: Home
//         "about.html", // 1: About
//         "location.html", // 2: Location
//         "blog.html", // 3: Blog
//         "contact.html", // 4: Contact
//     ];

//     const locationGroup = [
//         "haiphong.html",
//         "daklak.html",
//         "hue.html",
//         "china.html",
//         "vungtau.html",
//         "hatinh.html",
//     ];

//     const pathMap = {
//         "index.html": 0,
//         "about.html": 1,
//         "location.html": 2,
//         "blog.html": 3,
//         "contact.html": 4,
//     };

//     tabs.forEach((tab, i) => {
//         if (!tab.dataset.link && tabPaths[i]) {
//             tab.dataset.link = tabPaths[i];
//             console.log(tab, i);
//         }
//     });

//     menus.forEach((menu, i) => {
//         if (!menu.dataset.link && locationGroup[i]) {
//             menu.dataset.link = locationGroup[i];
//             console.log(menu, i);
//         }
//     });

//     const currentFile = location.pathname.split("/").pop() || "index.html";

//     // === 5️⃣ Xác định tab active dựa theo URL hoặc localStorage ===
//     let activeIndex = 0; // mặc định Home

//     if (locationGroup.includes(currentFile)) {
//         activeIndex = 2; // nhóm Location
//     } else if (pathMap[currentFile] !== undefined) {
//         activeIndex = pathMap[currentFile];
//     } else {
//         const saved = localStorage.getItem("activeIndex");
//         if (saved !== null && !isNaN(saved)) {
//             const idx = Number(saved);
//             if (idx >= 0 && idx < tabs.length) {
//                 activeIndex = idx;
//             }
//         }
//     }

//     // === 6️⃣ Active tab và cập nhật line ===
//     const prevActive = document.querySelector(".tab-item.active");
//     if (prevActive) prevActive.classList.remove("active");

//     const targetTab = tabs[activeIndex] || tabs[0];
//     targetTab.classList.add("active");

//     requestAnimationFrame(() => {
//         line.style.left = targetTab.offsetLeft + "px";
//         line.style.width = targetTab.offsetWidth + "px";
//     });

//     // === 7️⃣ Khi click tab ===
//     tabs.forEach((tab, index) => {
//         tab.addEventListener("click", () => {
//             document
//                 .querySelector(".tab-item.active")
//                 ?.classList.remove("active");
//             tab.classList.add("active");

//             line.style.left = tab.offsetLeft + "px";
//             line.style.width = tab.offsetWidth + "px";

//             localStorage.setItem(
//                 "lineActive",
//                 JSON.stringify({
//                     left: tab.offsetLeft + "px",
//                     width: tab.offsetWidth + "px",
//                 })
//             );
//             localStorage.setItem("activeIndex", index);

//             // // Chuyển trang theo data-link (tương đối)
//             const href = tab.dataset.link;
//             console.log(href);

//             // if (href) window.location.href = href;
//         });
//     });

//     // === 8️⃣ Khi click link trong nội dung ===
//     document.addEventListener("click", (e) => {
//         const link = e.target.closest("a");
//         if (!link) return;

//         // Lấy tên file cuối cùng (chuẩn hoá tương đối)
//         const absoluteURL = new URL(link.getAttribute("href"), location.origin);
//         const targetFile = absoluteURL.pathname.split("/").pop();

//         if (locationGroup.includes(targetFile)) {
//             localStorage.setItem("activeIndex", 2);
//         } else if (pathMap[targetFile] !== undefined) {
//             localStorage.setItem("activeIndex", pathMap[targetFile]);
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const tabPaths = [
        "index.html", // 0: Home
        "about.html", // 1: About
        "location.html", // 2: Location
        "blog.html", // 3: Blog
        "contact.html", // 4: Contact
    ];

    // --- 1️⃣ Gắn data-link cho tab chính ---
    tabs.forEach((tab, i) => {
        if (!tab.dataset.link && tabPaths[i]) {
            tab.dataset.link = tabPaths[i];
        }
    });

    // --- 2️⃣ Gắn data-link cho menu trong phần Location ---
    const locationGroup = [
        "haiphong.html",
        "daklak.html",
        "hue.html",
        "china.html",
        "vungtau.html",
        "hatinh.html",
    ];

    const menus = document.querySelectorAll(".menu__item");
    menus.forEach((menu, i) => {
        if (!menu.dataset.link && locationGroup[i]) {
            menu.dataset.link = locationGroup[i];
        }
    });

    // --- 3️⃣ Lấy file hiện tại ---
    const currentFile = location.pathname.split("/").pop() || "index.html";

    // --- 4️⃣ Map tab chính ---
    const pathMap = {
        "index.html": 0,
        "about.html": 1,
        "location.html": 2,
        "blog.html": 3,
        "contact.html": 4,
    };

    // --- 5️⃣ Xác định tab active ---
    let activeIndex = 0;
    if (Array.from(menus).some((m) => currentFile === m.dataset.link)) {
        activeIndex = 2; // Nếu đang ở trang trong nhóm Location
    } else if (pathMap[currentFile] !== undefined) {
        activeIndex = pathMap[currentFile];
    } else {
        const saved = localStorage.getItem("activeIndex");
        if (saved !== null && !isNaN(saved)) {
            const idx = Number(saved);
            if (idx >= 0 && idx < tabs.length) activeIndex = idx;
        }
    }

    // --- 6️⃣ Active tab + line ---
    document.querySelector(".tab-item.active")?.classList.remove("active");
    const targetTab = tabs[activeIndex] || tabs[0];

    targetTab.classList.add("active");

    requestAnimationFrame(() => {
        line.style.left = targetTab.offsetLeft + "px";
        line.style.width = targetTab.offsetWidth + "px";
    });

    // --- 7️⃣ Khi click tab ---
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", (e) => {
            const anchor = e.target.closest("a");

            if (anchor) {
                const href = anchor.getAttribute("href");

                if (
                    href &&
                    !href.startsWith("#") &&
                    !href.startsWith("javascript:")
                ) {
                    const file = new URL(href, location.origin).pathname
                        .split("/")
                        .pop();
                    if (
                        Array.from(menus).some((m) => file === m.dataset.link)
                    ) {
                        localStorage.setItem("activeIndex", 2);
                    } else if (pathMap[file] !== undefined) {
                        localStorage.setItem("activeIndex", pathMap[file]);
                    }
                    return; // ⚠️ Cho phép browser tự đi link
                }
            }

            // Nếu click vùng trống tab (li)
            e.preventDefault();
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

            const href = tab.dataset.link;
            if (href) window.location.href = href;
        });
    });

    // --- 8️⃣ Khi click link trong nội dung hoặc menu ---
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("javascript:"))
            return;

        const targetFile = new URL(href, location.origin).pathname
            .split("/")
            .pop();

        if (Array.from(menus).some((m) => targetFile === m.dataset.link)) {
            localStorage.setItem("activeIndex", 2);
        } else if (pathMap[targetFile] !== undefined) {
            localStorage.setItem("activeIndex", pathMap[targetFile]);
        }
    });
});

// Handle Like
const likeBoxes = $$(".blog-item__like");

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

// ------------------------------------------
// Handle modal
const menuBtn = $(".navbar-menu__icon");
const mobileNavbar = $(".navbar-mobile");
const overlay = $(".overlay");
const closeBtn = $(".navbar-close");
const body = document.body;
const navbarLinkIcon = $(".navbar__link--icon");
const navbarItemMenu = $(".navbar__item--menu-mobile");
const menuMobile = $(".navbar__item--menu-mobile .menu");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        mobileNavbar.classList.add("show");
        overlay.classList.add("show");

        Object.assign(body.style, {
            overflow: "hidden",
            position: "fixed",
            width: "100%",
        });
    });

    const closeMenu = () => {
        mobileNavbar.classList.remove("show");
        overlay.classList.remove("show");
        Object.assign(body.style, {
            overflow: "",
            position: "",
            width: "",
        });
    };

    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    navbarLinkIcon.addEventListener("click", (e) => {
        e.preventDefault();

        menuMobile.classList.toggle("show");

        navbarItemMenu.classList.toggle("active");
    });

    const menuItems = $$(".menu__item");

    menuItems.forEach((item) => {
        const subMenu = item.querySelector(".sub-menu");
        const link = item.querySelector(".menu__link");

        if (subMenu && link) {
            link.addEventListener("click", (e) => {
                document
                    .querySelectorAll(".menu__item.active")
                    .forEach((activeItem) => {
                        if (activeItem !== item) {
                            activeItem.classList.remove("active");
                            activeItem
                                .querySelector(".sub-menu")
                                ?.classList.remove("show");
                        }
                    });

                subMenu.classList.toggle("show");
                item.classList.toggle("active");
            });
        }
    });
}
