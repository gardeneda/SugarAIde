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
		loader.style.display = "block";

		// Create the request object
		const request = {};

		// Iterate over the form fields
		[...form.elements].forEach(function (element) {
			// Exclude the submit button from the request
			if (element.type !== "submit") {
				request[element.name] = element.value;
			}
		});

		// Make the form submission
		const response = await fetch(
			`${API_BASE_URL}/health/form`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(request),
			}
		);

		window.location.href = "/risk";

	} else {
		// Add is-invalid class to the form
		form.classList.add("is-invalid");
	}

	// Add Bootstrap validation classes to the form fields
	[...form.elements].forEach(function (element) {
		if (element.checkValidity()) {
			element.classList.remove("is-invalid");
			element.classList.add("is-valid");
		} else {
			element.classList.remove("is-valid");
			element.classList.add("is-invalid");
		}
	});
});
