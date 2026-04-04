const API = "http://10.0.0.239:8081";

async function download() {
  const url = document.getElementById("videoUrl").value;
  const format = document.getElementById("format").value;
  const quality = document.getElementById("quality").value;

  if (!url) return alert("Enter URL");

  // Start download
  const startRes = await fetch(
    `${API}/start?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`
  );

  const { id } = await startRes.json();

  const bar = document.getElementById("progressFill");
  const text = document.getElementById("statusText");

  // Poll progress
  const interval = setInterval(async () => {
    const res = await fetch(`${API}/progress/${id}`);
    const data = await res.json();

    if (data.percent) {
      bar.style.width = data.percent + "%";
      text.innerText = `Downloading: ${data.percent}%`;
    }

    if (data.status === "done") {
      clearInterval(interval);
      text.innerText = "Download ready!";

      // Download file
      window.location.href = `${API}/download-file/${id}`;
    }

    if (data.status === "error") {
      clearInterval(interval);
      text.innerText = "Error occurred";
    }
  }, 1000);
}