export function initFlipCard() {
    const cards = $$(".flip-card");
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            card.classList.toggle("is-flipped");
        });
    });
}
