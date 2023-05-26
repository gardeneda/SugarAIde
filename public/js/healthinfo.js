const submitBtn = document.getElementById("send-form");
const loader = document.querySelector("#loader");

// submitBtn.addEventListener('click', (event) => {
//     loader.style.display = 'block';
// })

// Get the form element
const form = document.querySelector(".needs-validation");

// Add submit event listener to the form
form.addEventListener("submit", async function (event) {
    // Prevent form submission
    event.preventDefault();
    event.stopPropagation();

    // Check if the form is valid
    if (form.checkValidity()) {
        // Add is-valid class to the form
        form.classList.add("is-valid");
        console.log("#1 Flag: Finished");
    } else {
        // Add is-invalid class to the form
        form.classList.add("is-invalid");
    }

    // Add Bootstrap validation classes to the form fields
    [...form.elements].forEach(function (element) {
        if (element.checkValidity()) {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            console.log(('#2 Flag: Finished'));
        } else {
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
        }
    });
})
    
    if (form.checkValidity()) {
        const response = await fetch("https://drab-rose-indri-sari.cyclic.app/health/form", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
    }
});
