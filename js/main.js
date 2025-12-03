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

// Handle blog (LocalStorage only with default posts)

// ====== Default posts  ======
const DEFAULT_POSTS = [
    {
        id: 1,
        title: "ベトナム中部高原の魅力、ダクラク省",
        content:
            "ダクラク省はベトナム中部高原に位置し、雄大な自然と豊かな民族文化で知られています。特にバンメトートは「コーヒーの首都」と呼ばれ、世界的に高品質なコーヒーの産地として有名です。また、ヨックドン国立公園やドラエヌール滝など、手つかずの自然景観が多く、訪れる人々に癒やしと冒険を提供します。少数民族エデ族の伝統的な長屋や祭りは独自の文化体験として魅力的で、ダクラクは歴史・自然・文化の調和が息づく特別な場所です。",
        author: "Admin",
        avatar: "./assets/avatar/blog.JPG",
        image: "./assets/images/daklak/daklak-4.4.png",
        like: 0,
        date: "2025年1月1日",
        createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
        id: 2,
        title: "海と港の活気あふれる都市、ハイフォン",
        content:
            "ハイフォンはベトナム北部を代表する港湾都市で、経済と文化が調和した活気に満ちた街です。主要な海の玄関口として国際貿易の中心的役割を担い、近代的な都市景観とフランス植民地時代の建築が美しく融合しています。また、カットバ島やランハ湾など、壮大な自然景観にも恵まれ、多くの観光客を魅了します。紅花の街としても知られ、春になると通りが鮮やかな花々で彩られます。ハイフォンは歴史、海、文化が息づく魅力的な都市です。",
        author: "Admin",
        avatar: "./assets/avatar/blog.JPG",
        image: "./assets/images/haiphong/hai-phong-2.1.png",
        like: 0,
        date: "2025年1月2日",
        createdAt: "2025-01-02T00:00:00.000Z",
    },
    {
        id: 3,
        title: "美しい海岸線とリゾートの街、ブンタウ",
        content:
            "ブンタウはホーチミン市から近く、週末旅行の人気スポットとして知られる海辺のリゾート都市です。長く続く美しいビーチと穏やかな海は、リラックスやマリンスポーツに最適で、多くの観光客を魅了します。市内にはキリスト像や灯台、古い寺院など見どころも多く、海と文化の両方を楽しめます。新鮮な海産物や独特の食文化もブンタウの大きな魅力で、訪れる人々に忘れられない体験を提供する街です。",
        author: "Admin",
        avatar: "./assets/avatar/blog.JPG",
        image: "./assets/images/vungtau/trai-nghiem.jpg",
        like: 0,
        date: "2025年1月3日",
        createdAt: "2025-01-03T00:00:00.000Z",
    },
];

const STORAGE_KEY = "blog_posts_v1";

// ===== LocalStorage helpers =====
function getPosts() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            savePosts(DEFAULT_POSTS);
            return [...DEFAULT_POSTS];
        }

        const data = JSON.parse(raw);
        if (!Array.isArray(data) || data.length === 0) {
            savePosts(DEFAULT_POSTS);
            return [...DEFAULT_POSTS];
        }

        return data;
    } catch (err) {
        console.warn("Error reading posts from localStorage", err);
        return [...DEFAULT_POSTS];
    }
}

function savePosts(posts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
        console.warn("Error saving posts to localStorage", err);
    }
}

function generateId(posts) {
    if (!posts.length) return 1;
    const maxId = posts.reduce((max, p) => {
        const id = Number(p.id) || 0;
        return id > max ? id : max;
    }, 0);
    return maxId + 1;
}

// ===== Render UI =====
function createPostHTML(post) {
    const avatar = post.avatar || "./assets/avatar/blog.JPG";
    const imageSrc = post.image || "./assets/images/blog/blog-1.jpg";
    const author = post.author || "Admin";

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
                    alt="${author}"
                    class="blog-item__avatar"
                />
                <div class="blog-item__info">
                    <h3 class="blog-item__name">${author}</h3>
                    <p class="blog-item__publishedAt">
                        ${post.date || ""}
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

function renderPosts() {
    const container = $(".blog-lists");
    if (!container) return;

    const posts = getPosts().sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    if (!posts.length) {
        container.innerHTML = `<p>まだ投稿がありません。</p>`;
        return;
    }

    container.innerHTML = posts.map(createPostHTML).join("");
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

// ===== Form logic (create + edit) =====
function setupForm() {
    const form = $("#post-form");
    const titleInput = $("#title");
    const contentInput = $("#content");
    const fileInput = $("#image");
    const idInput = $("#post-id");
    const fileTrigger = $("#file-trigger");
    const fileName = $("#file-name");
    const preview = $("#preview");

    if (
        !form ||
        !titleInput ||
        !contentInput ||
        !fileInput ||
        !fileTrigger ||
        !fileName ||
        !preview
    ) {
        console.warn("Blog form elements not found");
        return;
    }

    // mở dialog chọn file
    fileTrigger.addEventListener("click", () => fileInput.click());

    // change file
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

    // submit form
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

        let base64Image = "";
        if (file) {
            try {
                base64Image = await readImageAsBase64(file);
            } catch (err) {
                console.error("Image convert error", err);
            }
        }

        const posts = getPosts();

        if (editingId) {
            // UPDATE
            const idx = posts.findIndex(
                (p) => String(p.id) === String(editingId)
            );
            if (idx !== -1) {
                posts[idx] = {
                    ...posts[idx],
                    title,
                    content,
                    date,
                    image: base64Image || posts[idx].image || "",
                    updatedAt: new Date().toISOString(),
                };
            }
        } else {
            // CREATE
            const newPost = {
                id: generateId(posts),
                title,
                content,
                author: "Admin",
                avatar: "./assets/avatar/blog.JPG",
                image: base64Image,
                like: 0,
                date,
                createdAt: new Date().toISOString(),
            };
            posts.push(newPost);
        }

        savePosts(posts);
        renderPosts();

        // reset form
        form.reset();
        idInput.value = "";
        fileInput.value = "";
        fileName.textContent = "ファイルが選択されていません";
        preview.innerHTML = "";
        preview.style.display = "none";
    });
}

// ===== Actions (like / edit / delete) =====
function setupActions() {
    const list = $(".blog-lists");
    const form = $("#post-form");
    const titleInput = $("#title");
    const contentInput = $("#content");
    const idInput = $("#post-id");
    const fileName = $("#file-name");
    const preview = $("#preview");

    if (!list) return;

    list.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        const posts = getPosts();
        const idx = posts.findIndex((p) => String(p.id) === String(id));
        if (idx === -1) return;

        // LIKE
        if (action === "like") {
            const key = `liked-${id}`;
            let liked = localStorage.getItem(key) === "true";
            liked = !liked;

            const currentLike = posts[idx].like || 0;
            posts[idx].like = Math.max(currentLike + (liked ? 1 : -1), 0);
            savePosts(posts);
            localStorage.setItem(key, liked);

            renderPosts();
            return;
        }

        // DELETE
        if (action === "delete") {
            if (!confirm("この記事を削除しますか？")) return;

            const newPosts = posts.filter((p) => String(p.id) !== String(id));
            savePosts(newPosts);
            renderPosts();
            return;
        }

        // EDIT
        if (action === "edit") {
            const post = posts[idx];

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
    });
}

// ===== Init blog feature =====
document.addEventListener("DOMContentLoaded", () => {
    setupForm();
    setupActions();
    renderPosts();
});
