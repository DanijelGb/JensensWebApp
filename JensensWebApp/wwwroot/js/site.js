document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.getElementById("dark-mode-checkbox");
    const body = document.body;

    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        checkbox.checked = true;
    }

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});
