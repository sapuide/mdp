let allImages = [];
let currentCategory = "Semua";
let currentIndex = 0;

async function loadGallery() {
  try {
    const response = await fetch("https://s3-st-mn.mutiaracorporate.com/hgc/master/img/gallery.json");
    const data = await response.json();

    // Ubah struktur JSON agar menjadi list gambar umum
    allImages = Object.entries(data).flatMap(([category, files]) =>
      files.map(file => ({ file, category }))
    );

    const categories = ["Semua", ...Object.keys(data)];
    createCategoryButtons(categories);
    displayImages("Semua");
  } catch (error) {
    console.error("Gagal memuat galeri:", error);
  }
}

function createCategoryButtons(categories) {
  const container = document.getElementById("category-buttons");
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === "Semua") btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentCategory = cat;
      document.querySelectorAll(".category-buttons button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayImages(cat);
    });
    container.appendChild(btn);
  });
}

function displayImages(category) {
  const galleryContainer = document.getElementById("gallery");
  galleryContainer.innerHTML = "";

  const filtered = category === "Semua"
    ? allImages
    : allImages.filter(img => img.category === category);

  filtered.forEach((item, index) => {
    const img = document.createElement("img");
    img.src = `https://s3-st-mn.mutiaracorporate.com/hgc/master/img/gallery/${item.file}`;
    img.alt = item.category;
    img.dataset.index = index;
    img.setAttribute("draggable", "false");
    img.addEventListener("click", () => openLightbox(filtered, index));
    galleryContainer.appendChild(img);
  });
}

function openLightbox(images, index) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  const filtered = currentCategory === "Semua"
    ? allImages
    : allImages.filter(img => img.category === currentCategory);

  lightbox.style.display = "flex";
  lightboxImg.src = `https://s3-st-mn.mutiaracorporate.com/hgc/master/img/gallery/${filtered[index].file}`;
  currentIndex = index;

  document.querySelector(".prev").onclick = () => {
    currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    lightboxImg.src = `https://s3-st-mn.mutiaracorporate.com/hgc/master/img/gallery/${filtered[currentIndex].file}`;
  };

  document.querySelector(".next").onclick = () => {
    currentIndex = (currentIndex + 1) % filtered.length;
    lightboxImg.src = `https://s3-st-mn.mutiaracorporate.com/hgc/master/img/gallery/${filtered[currentIndex].file}`;
  };

  document.querySelector(".close").onclick = () => lightbox.style.display = "none";
  lightbox.onclick = (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
  };
}
// Nonaktifkan klik kanan di seluruh halaman
document.addEventListener("contextmenu", event => {
  // Jika elemen yang diklik adalah gambar, cegah menu klik kanan
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});
document.addEventListener("dragstart", event => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});
document.addEventListener("DOMContentLoaded", loadGallery);
