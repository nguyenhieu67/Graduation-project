// click overview thumb and description ------ ヒエウさんが作った性能

export function initGalleryModal() {
    const items = $$(".item");

    const overlay = $(".overlay");
    const overlayContent = overlay.querySelector(".overlay__content");
    const overlayImg = overlay.querySelector(".overlay__img");
    const overlayTitle = overlay.querySelector(".overlay__title");
    const overlayDesc = overlay.querySelector(".overlay__desc");
    const thumbsContainer = $(".overlay__thumbs");
    const overlayBtn = $(".overlay__btn");

    let currentIndex = 0;
    let timeId = null;

    items.forEach((item, index) => {
        const img = item.querySelector(".item__img");
        const imageBtn = document.createElement("button");
        imageBtn.className = "overlay__thumb";
        imageBtn.dataset.index = index;

        imageBtn.innerHTML = `
    <img src="${img.src}" alt="${img.alt || ""}">
  `;

        imageBtn.addEventListener("click", () => {
            openModal(index);
        });

        thumbsContainer.appendChild(imageBtn);
    });

    const thumbButtons = $$(".overlay__thumb");

    function setModalContent(index) {
        currentIndex = index;
        const item = items[index];

        const img = item.querySelector(".item__img");
        const title = item.querySelector(".item__title");
        const desc = item.querySelector(".item__desc");

        overlayImg.src = img.src;
        overlayImg.alt = img.alt || "";
        overlayTitle.textContent = title.textContent.trim();
        overlayDesc.innerHTML = desc.innerHTML.trim();

        thumbButtons.forEach((btn, i) => {
            btn.classList.toggle("is-active", i === index);
        });
    }

    function openModal(index) {
        setModalContent(index);
        overlay.classList.add("show");
    }

    function closeModal() {
        overlay.classList.remove("show");
        stopAutoplay();
        resetPlayBtn();
    }

    // Auto play / pause
    const button = document.createElement("button");
    button.className = "overlay__action-btn";
    button.textContent = "再生";

    overlayBtn.appendChild(button);

    const actionBtn = $(".overlay__action-btn");

    function startAutoplay() {
        if (timeId) return;

        timeId = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) {
                nextIndex = 0;
            }

            setModalContent(nextIndex);
        }, 5000);

        actionBtn.classList.add("playing");
        actionBtn.textContent = "停止";
    }

    function stopAutoplay() {
        if (timeId) {
            clearInterval(timeId);
            timeId = null;
        }

        resetPlayBtn();
    }

    actionBtn.addEventListener("click", () => {
        if (timeId) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    function resetPlayBtn() {
        actionBtn.classList.remove("playing");
        actionBtn.textContent = "再生";
    }

    items.forEach((item, index) => {
        const thumb = item.querySelector(".item__thumb");
        if (!thumb) return;

        thumb.addEventListener("click", () => {
            openModal(index);
        });
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
}
