// Loading text form left to right and /n --- ズンさんは作った性能。

export function initTypingEffect() {
    const items = $$(".item");
    items.forEach((item) => {
        const thumb = item.querySelector(".item__thumb");
        const desc = item.querySelector(".item__desc");

        const fullText = desc.textContent.trim();
        desc.textContent = "";

        let index = 0;
        let typingTimer = null;
        let hideTimer = null;

        function typeStep() {
            const ch = fullText[index];

            if (ch === "\n") {
                desc.innerHTML += "<br>";
            } else {
                desc.innerHTML += `<span class="char">${ch}</span>`;
            }

            index++;

            if (index >= fullText.length) {
                clearInterval(typingTimer);
                typingTimer = null;
            }
        }

        function startTyping() {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }

            desc.classList.add("active");

            if (typingTimer) return;

            if (index >= fullText.length) return;

            typingTimer = setInterval(typeStep, 10);
        }

        function handleLeave() {
            if (typingTimer) {
                clearInterval(typingTimer);
                typingTimer = null;
            }

            hideTimer = setTimeout(() => {
                desc.classList.remove("active");

                setTimeout(() => {
                    desc.innerHTML = "";
                    index = 0;
                }, 500);
            }, 5000);
        }

        thumb.addEventListener("mouseenter", startTyping);
        thumb.addEventListener("mouseleave", handleLeave);
    });
}
