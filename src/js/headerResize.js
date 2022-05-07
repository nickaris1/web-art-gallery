const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const header = document.querySelector(".Header");
const h1ref = document.querySelector(".Header h1");

window.addEventListener('resize', (event) => {
    if (document.body.clientWidth < 650) {
        header.style.flexDirection = "column";
        h1ref.style.fontSize = clamp(32 * ( document.body.clientWidth / 650), 16, 32) + "px";
    } else if (document.body.clientWidth >= 650) {
        header.style.flexDirection = "row";
        h1ref.style.fontSize = "32px";
    }
});