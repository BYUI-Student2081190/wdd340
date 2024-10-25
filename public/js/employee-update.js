const form = document.querySelector("#edit-employee-data")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#update-employee-data-button")
      updateBtn.removeAttribute("disabled")
    })