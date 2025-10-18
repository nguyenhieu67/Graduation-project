const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function load(selector, path) {
    const cached = localStorage.getItem(path);
    if (cached) {
        $(selector).innerHTML = cached;
    }

    fetch(path)
        .then((res) => res.text())
        .then((html) => {
            if (html !== cached) {
                $(selector).innerHTML = html;
                localStorage.setItem(path, html);
            }
        })
        .finally(() => {
            window.dispatchEvent(new Event("template-loaded"));
        });
}

// Tab line

// setTimeout(() => {
//     const tabs = $$(".tab-item");

//     const tabActive = $(".tab-item.active");
//     const line = $(".tabs .line");

//     line.style.left = tabActive.offsetLeft + "px";
//     line.style.width = tabActive.offsetWidth + "px";

//     tabs.forEach((tab) => {
//         tab.onmouseenter = function () {
//             $(".tab-item.active").classList.remove("active");

//             line.style.left = this.offsetLeft + "px";
//             line.style.width = this.offsetWidth + "px";
//             this.classList.add("active");
//         };
//     });
// }, 1);
