
document.querySelectorAll("label").forEach(label => {
    label.addEventListener('change', () => {
        label.classList.toggle("checkedBox");
    })
})