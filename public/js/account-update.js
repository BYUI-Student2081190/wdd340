// Top form
const form = document.querySelector("#account_update_form")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update_account_info")
      updateBtn.removeAttribute("disabled")
    })

// Bottom form
const bottomForm = document.querySelector("#update_password_form")
    bottomForm.addEventListener("change", function () {
        const pwUpdateButton = document.querySelector("#change_password")
        pwUpdateButton.removeAttribute("disabled")
    })