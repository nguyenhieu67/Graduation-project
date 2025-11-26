import { initTypingEffect } from "./features/typingEffect.js";
import { initGalleryModal } from "./features/galleryModal.js";
import { initFlipCard } from "./features/flipCard.js";

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

const line = $(".tabs .line");

document.addEventListener("DOMContentLoaded", () => {
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

    const locationGroup = [
        "haiphong.html",
        "daklak.html",
        "hue.html",
        "china.html",
        "vungtau.html",
        "hatinh.html",
    ];

    const menus = $$(".menu__item");
    menus.forEach((menu, i) => {
        if (!menu.dataset.link && locationGroup[i]) {
            menu.dataset.link = locationGroup[i];
        }
    });

    const currentFile = location.pathname.split("/").pop() || "index.html";

    // ===== Breadcrumb active following currentFile =====
    const breadcrumbLinks = $$(".breadcrumb-link");

    if (breadcrumbLinks.length) {
        breadcrumbLinks.forEach((link) => link.classList.remove("active"));

        const activeCrumb = Array.from(breadcrumbLinks).find((link) => {
            const hrefFile = link.getAttribute("href")?.split("/").pop();
            return hrefFile === currentFile;
        });

        (activeCrumb || breadcrumbLinks[0]).classList.add("active");
    }

    const pathMap = {
        "index.html": 0,
        "about.html": 1,
        "location.html": 2,
        "blog.html": 3,
        "contact.html": 4,
    };

    let activeIndex = 0;
    if (Array.from(menus).some((m) => currentFile === m.dataset.link)) {
        activeIndex = 2;
    } else if (pathMap[currentFile] !== undefined) {
        activeIndex = pathMap[currentFile];
    } else {
        const saved = localStorage.getItem("activeIndex");
        if (saved !== null && !isNaN(saved)) {
            const idx = Number(saved);
            if (idx >= 0 && idx < tabs.length) activeIndex = idx;
        }
    }

    document.querySelector(".tab-item.active")?.classList.remove("active");

    const targetTab = tabs[activeIndex] ?? tabs[0];

    targetTab.classList.add("active");

    requestAnimationFrame(() => {
        line.style.left = targetTab.offsetLeft + "px";
        line.style.width = targetTab.offsetWidth + "px";
    });

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
                    return;
                }
            }

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
// const likeBoxes = $$(".blog-item__like");

// likeBoxes.forEach((likeBox, index) => {
//     const likeIcon = likeBox.querySelector(".blog-item__like--icon");
//     const key = `liked-${index}`;

//     let liked = localStorage.getItem(key) === "true";

//     if (liked) {
//         likeBox.classList.add("liked");
//         likeIcon.classList.add("liked");
//         likeIcon.src = "./assets/icon/heart-filled.svg";
//     }

//     likeBox.addEventListener("click", () => {
//         liked = !liked;

//         if (liked) {
//             likeBox.classList.add("liked");
//             likeIcon.classList.add("liked");
//             likeIcon.src = "./assets/icon/heart-filled.svg";
//         } else {
//             likeBox.classList.remove("liked");
//             likeIcon.classList.remove("liked");
//             likeIcon.src = "./assets/icon/like.svg";
//         }

//         localStorage.setItem(key, liked);
//     });
// });

// ------------------------------------------
// Handle modal
const menuBtn = $(".navbar-menu__icon");
const mobileNavbar = $(".navbar-mobile");
const overlayMobile = $(".overlay-mobile");
const closeBtn = $(".navbar-close");
const body = document.body;
const navbarLinkIcon = $(".navbar__link--icon");
const navbarItemMenu = $(".navbar__item--menu-mobile");
const menuMobile = $(".navbar__item--menu-mobile .menu");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        mobileNavbar.classList.add("show");
        overlayMobile.classList.add("show");

        Object.assign(body.style, {
            overflow: "hidden",
            position: "fixed",
            width: "100%",
        });
    });

    const closeMenu = () => {
        mobileNavbar.classList.remove("show");
        overlayMobile.classList.remove("show");
        Object.assign(body.style, {
            overflow: "",
            position: "",
            width: "",
        });
    };

    closeBtn.addEventListener("click", closeMenu);
    overlayMobile.addEventListener("click", closeMenu);

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

                if (window.outerWidth <= 768) {
                    e.preventDefault();
                }

                subMenu.classList.toggle("show");
                item.classList.toggle("active");
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const feature = document.body.dataset.feature;

    if (feature === "typing") initTypingEffect();
    if (feature === "gallery") initGalleryModal();
    if (feature === "flip") initFlipCard();
});

// Handle blog
const API_URL = "http://localhost:3000/posts";

// ===== API helpers =====
async function fetchPosts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

async function fetchPost(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
}

async function createPost(post) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
}

async function updatePost(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}

async function deletePost(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete post");
}

// ===== UI render =====
function createPostHTML(post) {
    const avatar = post.avatar || "./assets/avatar/blog.JPG";
    const imageSrc = post.image || "./assets/images/blog/blog-1.jpg";

    let liked = false;
    try {
        if (typeof localStorage !== "undefined") {
            liked = localStorage.getItem(`liked-${post.id}`) === "true";
        }
    } catch (e) {
        console.warn("localStorage is not available", e);
    }

    return `
    <article class="blog-item">
        <a href="#!">
            <img
                src="${imageSrc}"
                class="blog-item__img"
                alt="${post.title}"
            />
        </a>
        <div class="blog-item__wrap">
            <div class="blog-item__inner">
                <img
                    src="${avatar}"
                    alt="${post.author}"
                    class="blog-item__avatar"
                />
                <div class="blog-item__info">
                    <h3 class="blog-item__name">${post.author}</h3>
                    <p class="blog-item__publishedAt">
                        ${post.date}
                    </p>
                </div>
            </div>

            <a href="#!">
                <h2 class="blog-item__title">
                    ${post.title}
                </h2>
            </a>
            <p class="blog-item__desc">
                ${post.content}
            </p>

            <div class="blog-item__actions">
               <div class="blog-item__like ${liked ? "liked" : ""}" 
                     data-action="like" 
                     data-id="${post.id}">
                    <img
                        src="${
                            liked
                                ? "./assets/icon/heart-filled.svg"
                                : "./assets/icon/like.svg"
                        }"
                        alt="Heart"
                        class="blog-item__like--icon ${liked ? "liked" : ""}"
                    />
                </div>
                <button
                    class="blog-item__btn blog-item__btn--edit"
                    data-action="edit"
                    data-id="${post.id}"
                >
                    編集
                </button>
                <button
                    class="blog-item__btn blog-item__btn--delete"
                    data-action="delete"
                    data-id="${post.id}"
                >
                    削除
                </button>
            </div>
        </div>
    </article>
    `;
}

async function renderPosts() {
    const container = document.querySelector(".blog-lists");
    if (!container) return;

    try {
        const posts = await fetchPosts();
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        container.innerHTML = posts.map(createPostHTML).join("");
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p>記事の読み込みに失敗しました。</p>`;
    }
}

// ===== Image helper =====
function readImageAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ===== Form logic  =====
function setupForm() {
    const form = document.getElementById("post-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const idInput = document.getElementById("post-id");
    const fileTrigger = document.getElementById("file-trigger");
    const fileName = document.getElementById("file-name");
    const preview = document.getElementById("preview");

    if (
        !form ||
        !titleInput ||
        !contentInput ||
        !fileInput ||
        !fileTrigger ||
        !fileName ||
        !preview
    ) {
        console.warn("Form elements not found");
        return;
    }

    fileTrigger.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (!file) {
            fileName.textContent = "ファイルが選択されていません";
            preview.innerHTML = "";
            preview.style.display = "none";
            return;
        }

        fileName.textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="preview" />`;
            preview.style.display = "flex";
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const editingId = idInput.value;

        if (!title || !content) return;

        const file = fileInput.files[0];

        const date = new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        try {
            let base64Image = "";
            if (file) {
                base64Image = await readImageAsBase64(file);
            }

            if (editingId) {
                // UPDATE
                let existing = await fetchPost(editingId);
                const finalImage = base64Image || existing.image || "";

                await updatePost(editingId, {
                    title,
                    content,
                    image: finalImage,
                });
            } else {
                // CREATE
                const newPost = {
                    title,
                    content,
                    author: "Admin",
                    createdAt: new Date().toISOString(),
                    date,
                    avatar: "./assets/avatar/blog.JPG",
                    image: base64Image,
                    like: 0,
                };

                await createPost(newPost);
            }

            await renderPosts();

            form.reset();
            idInput.value = "";
            fileInput.value = "";
            fileName.textContent = "ファイルが選択されていません";
            preview.innerHTML = "";
            preview.style.display = "none";
        } catch (err) {
            console.error(err);
            alert("投稿に失敗しました。");
        }
    });
}

// ===== Actions list (Edit + Delete) =====
function setupActions() {
    const list = document.querySelector(".blog-lists");
    const form = document.getElementById("post-form");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const idInput = document.getElementById("post-id");
    const fileName = document.getElementById("file-name");
    const preview = document.getElementById("preview");

    if (!list) return;

    list.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        // ===== LIKE =====
        if (action === "like") {
            const likeBox = btn;
            const likeIcon = likeBox.querySelector(".blog-item__like--icon");
            const key = `liked-${id}`;

            let liked = localStorage.getItem(key) === "true";
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

            try {
                const post = await fetchPost(id);
                const newLike = (post.like || 0) + (liked ? 1 : -1);
                await updatePost(id, { like: Math.max(newLike, 0) });
            } catch (err) {
                console.error(err);
            }

            return;
        }

        try {
            if (action === "delete") {
                await deletePost(id);
                await renderPosts();
                return;
            }

            if (action === "edit") {
                const post = await fetchPost(id);

                titleInput.value = post.title;
                contentInput.value = post.content;
                idInput.value = post.id;

                if (post.image) {
                    preview.innerHTML = `<img src="${post.image}" alt="preview" />`;
                    preview.style.display = "flex";
                    fileName.textContent = "現在の画像が設定されています";
                } else {
                    preview.innerHTML = "";
                    preview.style.display = "none";
                    fileName.textContent = "ファイルが選択されていません";
                }

                window.scrollTo({
                    top: form.offsetTop - 80,
                    behavior: "smooth",
                });
            }
        } catch (err) {
            console.error(err);
            alert("操作に失敗しました。");
        }
    });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
    setupForm();
    setupActions();
    renderPosts();
});
