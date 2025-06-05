const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage (gunakan database dalam produksi)
let mahasiswa = [
  { id: 1, nim: '12345', nama: 'Ahmad Sholeh', prodi: 'Teknik Informatika' },
  { id: 2, nim: '12346', nama: 'Sari Wulandari', prodi: 'Sistem Informasi' },
  { id: 3, nim: '12347', nama: 'Budi Santoso', prodi: 'Teknik Informatika' }
];

let absensi = [
  { 
    id: 1, 
    mahasiswaId: 1, 
    tanggal: '2025-06-05', 
    waktu: '08:00', 
    status: 'hadir',
    matakuliah: 'Pemrograman Web'
  },
  { 
    id: 2, 
    mahasiswaId: 2, 
    tanggal: '2025-06-05', 
    waktu: '08:15', 
    status: 'hadir',
    matakuliah: 'Pemrograman Web'
  }
];

let nextMahasiswaId = 4;
let nextAbsensiId = 3;

// Routes untuk Mahasiswa
// GET - Ambil semua mahasiswa
app.get('/api/mahasiswa', (req, res) => {
  res.json(mahasiswa);
});

// GET - Ambil mahasiswa berdasarkan ID
app.get('/api/mahasiswa/:id', (req, res) => {
  const mhs = mahasiswa.find(m => m.id === parseInt(req.params.id));
  if (!mhs) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
  res.json(mhs);
});

// POST - Tambah mahasiswa baru
app.post('/api/mahasiswa', (req, res) => {
  const { nim, nama, prodi } = req.body;
  
  if (!nim || !nama || !prodi) {
    return res.status(400).json({ error: 'NIM, nama, dan prodi harus diisi' });
  }

  const newMahasiswa = {
    id: nextMahasiswaId++,
    nim,
    nama,
    prodi
  };

  mahasiswa.push(newMahasiswa);
  res.status(201).json(newMahasiswa);
});

// PUT - Update mahasiswa
app.put('/api/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
  }

  const { nim, nama, prodi } = req.body;
  mahasiswa[index] = { ...mahasiswa[index], nim, nama, prodi };
  
  res.json(mahasiswa[index]);
});

// DELETE - Hapus mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
  }

  mahasiswa.splice(index, 1);
  // Hapus juga absensi mahasiswa tersebut
  absensi = absensi.filter(a => a.mahasiswaId !== id);
  
  res.json({ message: 'Mahasiswa berhasil dihapus' });
});

// Routes untuk Absensi
// GET - Ambil semua absensi dengan detail mahasiswa
app.get('/api/absensi', (req, res) => {
  const absensiWithDetails = absensi.map(abs => {
    const mhs = mahasiswa.find(m => m.id === abs.mahasiswaId);
    return {
      ...abs,
      mahasiswa: mhs
    };
  });
  res.json(absensiWithDetails);
});

// GET - Ambil absensi berdasarkan tanggal
app.get('/api/absensi/tanggal/:tanggal', (req, res) => {
  const tanggal = req.params.tanggal;
  const absensiByDate = absensi
    .filter(a => a.tanggal === tanggal)
    .map(abs => {
      const mhs = mahasiswa.find(m => m.id === abs.mahasiswaId);
      return {
        ...abs,
        mahasiswa: mhs
      };
    });
  res.json(absensiByDate);
});

// POST - Tambah absensi baru
app.post('/api/absensi', (req, res) => {
  const { mahasiswaId, tanggal, waktu, status, matakuliah } = req.body;
  
  if (!mahasiswaId || !tanggal || !waktu || !status || !matakuliah) {
    return res.status(400).json({ error: 'Semua field harus diisi' });
  }

  // Cek apakah mahasiswa sudah absen hari ini untuk mata kuliah yang sama
  const existingAbsensi = absensi.find(a => 
    a.mahasiswaId === mahasiswaId && 
    a.tanggal === tanggal && 
    a.matakuliah === matakuliah
  );

  if (existingAbsensi) {
    return res.status(400).json({ error: 'Mahasiswa sudah melakukan absensi untuk mata kuliah ini hari ini' });
  }

  const newAbsensi = {
    id: nextAbsensiId++,
    mahasiswaId,
    tanggal,
    waktu,
    status,
    matakuliah
  };

  absensi.push(newAbsensi);
  
  // Return dengan detail mahasiswa
  const mhs = mahasiswa.find(m => m.id === mahasiswaId);
  res.status(201).json({
    ...newAbsensi,
    mahasiswa: mhs
  });
});

// PUT - Update absensi
app.put('/api/absensi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = absensi.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Absensi tidak ditemukan' });
  }

  const { mahasiswaId, tanggal, waktu, status, matakuliah } = req.body;
  absensi[index] = { ...absensi[index], mahasiswaId, tanggal, waktu, status, matakuliah };
  
  // Return dengan detail mahasiswa
  const mhs = mahasiswa.find(m => m.id === mahasiswaId);
  res.json({
    ...absensi[index],
    mahasiswa: mhs
  });
});

// DELETE - Hapus absensi
app.delete('/api/absensi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = absensi.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Absensi tidak ditemukan' });
  }

  absensi.splice(index, 1);
  res.json({ message: 'Absensi berhasil dihapus' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('API Endpoints:');
  console.log('- GET /api/mahasiswa - Ambil semua mahasiswa');
  console.log('- POST /api/mahasiswa - Tambah mahasiswa');
  console.log('- PUT /api/mahasiswa/:id - Update mahasiswa');
  console.log('- DELETE /api/mahasiswa/:id - Hapus mahasiswa');
  console.log('- GET /api/absensi - Ambil semua absensi');
  console.log('- POST /api/absensi - Tambah absensi');
  console.log('- PUT /api/absensi/:id - Update absensi');
  console.log('- DELETE /api/absensi/:id - Hapus absensi');
});