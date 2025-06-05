// server.js - Backend API untuk Aplikasi Absensi
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database simulasi (dalam aplikasi nyata gunakan database seperti MongoDB/MySQL)
let mahasiswa = [
  { id: 1, nim: '2023001', nama: 'Ahmad Rizki', kelas: 'TI-3A', email: 'ahmad@email.com' },
  { id: 2, nim: '2023002', nama: 'Siti Nurhaliza', kelas: 'TI-3A', email: 'siti@email.com' },
  { id: 3, nim: '2023003', nama: 'Budi Santoso', kelas: 'TI-3B', email: 'budi@email.com' }
];

let absensi = [
  { 
    id: 1, 
    mahasiswa_id: 1, 
    tanggal: '2024-12-01', 
    waktu: '08:30:00', 
    status: 'Hadir',
    mata_kuliah: 'Pemrograman Web'
  },
  { 
    id: 2, 
    mahasiswa_id: 2, 
    tanggal: '2024-12-01', 
    waktu: '08:35:00', 
    status: 'Hadir',
    mata_kuliah: 'Pemrograman Web'
  }
];

let nextMahasiswaId = 4;
let nextAbsensiId = 3;

// === ROUTES MAHASISWA ===

// GET - Semua mahasiswa
app.get('/api/mahasiswa', (req, res) => {
  res.json({
    success: true,
    data: mahasiswa
  });
});

// GET - Mahasiswa by ID
app.get('/api/mahasiswa/:id', (req, res) => {
  const mhs = mahasiswa.find(m => m.id === parseInt(req.params.id));
  if (!mhs) {
    return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
  }
  res.json({ success: true, data: mhs });
});

// POST - Tambah mahasiswa
app.post('/api/mahasiswa', (req, res) => {
  const { nim, nama, kelas, email } = req.body;
  
  // Validasi NIM duplikat
  if (mahasiswa.find(m => m.nim === nim)) {
    return res.status(400).json({ success: false, message: 'NIM sudah terdaftar' });
  }

  const newMahasiswa = {
    id: nextMahasiswaId++,
    nim,
    nama,
    kelas,
    email
  };

  mahasiswa.push(newMahasiswa);
  res.status(201).json({ success: true, data: newMahasiswa });
});

// PUT - Update mahasiswa
app.put('/api/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
  }

  const { nim, nama, kelas, email } = req.body;
  
  // Validasi NIM duplikat (kecuali untuk mahasiswa yang sedang diupdate)
  const nimExists = mahasiswa.find(m => m.nim === nim && m.id !== id);
  if (nimExists) {
    return res.status(400).json({ success: false, message: 'NIM sudah terdaftar' });
  }

  mahasiswa[index] = { id, nim, nama, kelas, email };
  res.json({ success: true, data: mahasiswa[index] });
});

// DELETE - Hapus mahasiswa
app.delete('/api/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
  }

  // Hapus absensi terkait
  absensi = absensi.filter(a => a.mahasiswa_id !== id);
  
  mahasiswa.splice(index, 1);
  res.json({ success: true, message: 'Mahasiswa berhasil dihapus' });
});

// === ROUTES ABSENSI ===

// GET - Semua absensi dengan data mahasiswa
app.get('/api/absensi', (req, res) => {
  const absensiWithMahasiswa = absensi.map(abs => {
    const mhs = mahasiswa.find(m => m.id === abs.mahasiswa_id);
    return {
      ...abs,
      mahasiswa: mhs || null
    };
  });

  res.json({
    success: true,
    data: absensiWithMahasiswa
  });
});

// GET - Absensi by tanggal
app.get('/api/absensi/tanggal/:tanggal', (req, res) => {
  const tanggal = req.params.tanggal;
  const absensiHari = absensi.filter(abs => abs.tanggal === tanggal);
  
  const absensiWithMahasiswa = absensiHari.map(abs => {
    const mhs = mahasiswa.find(m => m.id === abs.mahasiswa_id);
    return {
      ...abs,
      mahasiswa: mhs || null
    };
  });

  res.json({
    success: true,
    data: absensiWithMahasiswa
  });
});

// POST - Tambah absensi (check-in)
app.post('/api/absensi', (req, res) => {
  const { mahasiswa_id, mata_kuliah } = req.body;
  
  // Cek apakah mahasiswa ada
  const mhs = mahasiswa.find(m => m.id === mahasiswa_id);
  if (!mhs) {
    return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
  }

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().split(' ')[0];

  // Cek apakah sudah absen hari ini untuk mata kuliah yang sama
  const sudahAbsen = absensi.find(abs => 
    abs.mahasiswa_id === mahasiswa_id && 
    abs.tanggal === today && 
    abs.mata_kuliah === mata_kuliah
  );

  if (sudahAbsen) {
    return res.status(400).json({ 
      success: false, 
      message: 'Mahasiswa sudah melakukan absensi untuk mata kuliah ini hari ini' 
    });
  }

  const newAbsensi = {
    id: nextAbsensiId++,
    mahasiswa_id,
    tanggal: today,
    waktu: now,
    status: 'Hadir',
    mata_kuliah
  };

  absensi.push(newAbsensi);
  
  // Return dengan data mahasiswa
  const absensiWithMahasiswa = {
    ...newAbsensi,
    mahasiswa: mhs
  };

  res.status(201).json({ success: true, data: absensiWithMahasiswa });
});

// DELETE - Hapus absensi
app.delete('/api/absensi/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = absensi.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Data absensi tidak ditemukan' });
  }

  absensi.splice(index, 1);
  res.json({ success: true, message: 'Data absensi berhasil dihapus' });
});

// === DASHBOARD STATS ===
app.get('/api/dashboard/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const absensiHariIni = absensi.filter(abs => abs.tanggal === today);
  
  res.json({
    success: true,
    data: {
      total_mahasiswa: mahasiswa.length,
      hadir_hari_ini: absensiHariIni.length,
      total_absensi: absensi.length,
      persentase_kehadiran: mahasiswa.length > 0 ? 
        Math.round((absensiHariIni.length / mahasiswa.length) * 100) : 0
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /api/mahasiswa           - Lihat semua mahasiswa`);
  console.log(`   POST   /api/mahasiswa           - Tambah mahasiswa baru`);
  console.log(`   PUT    /api/mahasiswa/:id       - Update mahasiswa`);
  console.log(`   DELETE /api/mahasiswa/:id       - Hapus mahasiswa`);
  console.log(`   GET    /api/absensi             - Lihat semua absensi`);
  console.log(`   POST   /api/absensi             - Check-in absensi`);
  console.log(`   GET    /api/absensi/tanggal/:tanggal - Absensi per tanggal`);
  console.log(`   GET    /api/dashboard/stats     - Dashboard statistik`);
});

// Export untuk testing
module.exports = app;