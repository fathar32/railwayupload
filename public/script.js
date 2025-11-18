const form = document.getElementById('uploadForm');
const resultBox = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/upload-csv', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const text = await response.text();
      resultBox.innerText = "✅ " + text;
      resultBox.style.color = "green";
    } else {
      const errorText = await response.text();
      resultBox.innerText = "❌ Upload gagal: " + errorText;
      resultBox.style.color = "red";
    }
  } catch (err) {
    resultBox.innerText = "❌ Terjadi error saat upload!";
    resultBox.style.color = "red";
  }
});
