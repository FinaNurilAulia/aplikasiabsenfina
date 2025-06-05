<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Absensi CRUD</title>
  <style>
    body { font-family: sans-serif; background: #eef; padding: 2rem; }
    input, button { padding: 6px; margin: 5px; }
    .item { padding: 10px; background: white; margin-top: 10px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>📋 Aplikasi Absensi (CRUD)</h1>

  <form id="form">
    <input type="text" id="nama" placeholder="Nama" required>
    <input type="text" id="lokasi" placeholder="Lokasi" required>
    <input type="hidden" id="editId">
    <button type="submit">Simpan</button>
  </form>

  <div id="list"></div>

  <script>
    const list = document.getElementById('list');
    const form = document.getElementById('form');
    const namaInput = document.getElementById('nama');
    const lokasiInput = document.getElementById('lokasi');
    const editId = document.getElementById('editId');

    async function loadData() {
      const res = await fetch('/api/absen');
      const data = await res.json();
      list.innerHTML = data.map(item => `
        <div class="item">
          <b>${item.nama}</b> - ${item.lokasi} 🕒 ${new Date(item.waktu * 1000).toLocaleTimeString()}
          <button onclick="edit('${item.id}', '${item.nama}', '${item.lokasi}')">Edit</button>
          <button onclick="hapus('${item.id}')">Hapus</button>
        </div>
      `).join('');
    }

    form.onsubmit = async e => {
      e.preventDefault();
      const nama = namaInput.value;
      const lokasi = lokasiInput.value;
      const waktu = Math.floor(Date.now() / 1000);

      const body = JSON.stringify({ nama, lokasi, waktu });

      if (editId.value) {
        await fetch(`/api/absen/${editId.value}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
      } else {
        await fetch('/api/absen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      }

      form.reset();
      editId.value = '';
      loadData();
    };

    window.edit = (id, nama, lokasi) => {
      namaInput.value = nama;
      lokasiInput.value = lokasi;
      editId.value = id;
    };

    window.hapus = async (id) => {
      await fetch(`/api/absen/${id}`, { method: 'DELETE' });
      loadData();
    };

    loadData();
  </script>
</body>
</html>