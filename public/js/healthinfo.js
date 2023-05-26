const submitBtn = document.getElementById("send-form");
const loader = document.querySelector("#loader");

submitBtn.addEventListener('click', (event) => {
    loader.style.display = 'block';
})