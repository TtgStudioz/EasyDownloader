const API = "http://10.0.0.239:8081";
// const API = "https://marina-corrected-calculations-obituaries.trycloudflare.com";

async function download() {
    const url = document.getElementById("videoUrl").value;
    const format = document.getElementById("format").value;
    const quality = document.getElementById("quality").value;

    if (!url) return alert("Enter URL");

    const bar = document.getElementById("progressFill");
    const text = document.getElementById("statusText");

    text.innerText = "Starting download...";
    bar.style.width = "0%";

    const startRes = await fetch(
        `${API}/start?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`
    );

    const { id } = await startRes.json();

    const interval = setInterval(async () => {
        const res = await fetch(`${API}/progress/${id}`);
        const data = await res.json();

        if (data.percent !== undefined) {
            bar.style.width = data.percent + "%";
            text.innerText = `Downloading: ${data.percent}%`;
        }

        if (data.percent == 100 && data.status === "downloading") {
            text.innerText = "Finalizing download...";
        }

        if (data.status === "processing") {
            text.innerText = "Processing video (merging audio/video)...";
        }

        if (data.status === "done") {
            clearInterval(interval);
            text.innerText = "Download ready!";
            // Download the file normally
            window.location.href = `${API}/download-file/${id}`;
        }

        if (data.status === "error") {
            clearInterval(interval);
            text.innerText = "Error occurred";
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById("downloadBtn");
    if (downloadButton) {
        downloadButton.addEventListener("click", download);
    }
});