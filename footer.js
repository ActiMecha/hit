document.addEventListener("DOMContentLoaded", function () {
    fetch("footer.html?v=20261006-footer")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});
