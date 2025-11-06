  const NEWS_URL = "https://s3-st-mn.mutiaracorporate.com/hgc/master/news.json";

  async function loadNews() {
    const container = document.getElementById("news-container");
    if (!container) return;

    container.textContent = "Memuat berita...";

    try {
      const response = await fetch(NEWS_URL, { cache: "no-cache" });
      if (!response.ok) throw new Error("Gagal memuat berita");
      const data = await response.json();

      container.innerHTML = "";

      if (!data.news || data.news.length === 0) {
        container.textContent = "Belum ada berita saat ini.";
        return;
      }

      data.news.forEach(item => {
        const el = document.createElement("div");
        el.className = "news-item";

        const titleHTML = DOMPurify.sanitize(marked.parseInline(item.title || ""));
        const contentHTML = DOMPurify.sanitize(marked.parse(item.content || ""));

        el.innerHTML = `
          <h3>${titleHTML}</h3>
          <small>${item.date}</small>
          <div class="news-content">${contentHTML}</div>
        `;

        container.appendChild(el);
      });

    } catch (err) {
      container.textContent = "Error: " + err.message;
    }
  }
  document.addEventListener("DOMContentLoaded", loadNews);
