document.getElementById("searchBtn").addEventListener("click", performSearch);

document.getElementById("searchInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    const engine = document.getElementById("engineSelect").value;

    if (!query) return;

    let url = "";

    if (engine === "google") {
        url = "https://www.google.com/search?q=" + encodeURIComponent(query);
    } else {
        url = "https://www.bing.com/search?q=" + encodeURIComponent(query);
    }

    window.open(url, "_blank");
}