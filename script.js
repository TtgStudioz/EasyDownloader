const API_BASE = "http://10.0.0.239:8081";

document.getElementById('downloadBtn').addEventListener('click', () => {
    const url = document.getElementById('videoUrl').value;
    const format = document.getElementById('format').value;
    const quality = document.getElementById('quality').value;

    if (!url) {
        alert("Please paste a YouTube URL!");
        return;
    }

    // Reset and show progress UI
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const statusText = document.getElementById('statusText');
    
    progressContainer.classList.remove('hidden');
    progressFill.style.width = '0%';
    statusText.innerText = "Connecting to server...";

    // 1. Trigger the actual download via browser
    // We use window.location.href so the browser handles the stream-to-file logic
    const downloadUrl = `${API_BASE}/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`;
    window.location.href = downloadUrl;

    // 2. Start listening to progress updates
    const eventSource = new EventSource(`${API_BASE}/progress?url=${encodeURIComponent(url)}`);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.percent) {
            progressFill.style.width = `${data.percent}%`;
            statusText.innerText = `Downloading: ${data.percent}%`;
        }

        if (data.done) {
            statusText.innerText = "Download complete!";
            eventSource.close();
        }
    };

    eventSource.onerror = () => {
        statusText.innerText = "Error fetching progress.";
        eventSource.close();
    };
});