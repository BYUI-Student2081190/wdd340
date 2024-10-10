// Obtain the button and password
const passwordButton = document.querySelector(".pwButton")
const passwordInput = document.querySelector(".pw")

passwordButton.addEventListener('click', function() {
    const type = passwordInput.getAttribute("type")
    if (type == "password") {
        passwordInput.setAttribute("type", "text");
        passwordButton.innerHTML = "Hide Password";
    } else {
        passwordInput.setAttribute("type", "password");
        passwordButton.innerHTML = "Show Password";
    }
})