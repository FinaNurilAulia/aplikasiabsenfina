<template>
  <div id="app">
    <div class="container">
      <h1>Sistem Absensi</h1>
      
      <!-- Form Absensi -->
      <div class="absensi-form">
        <h2>Form Absensi</h2>
        <form @submit.prevent="submitAbsensi">
          <div class="form-group">
            <label for="nama">Nama:</label>
            <input 
              type="text" 
              id="nama" 
              v-model="form.nama" 
              required
              placeholder="Masukkan nama Anda"
            >
          </div>
          
          <div class="form-group">
            <label for="nim">NIM:</label>
            <input 
              type="text" 
              id="nim" 
              v-model="form.nim" 
              required
              placeholder="Masukkan NIM Anda"
            >
          </div>
          
          <div class="form-group">
            <label for="kelas">Kelas:</label>
            <select id="kelas" v-model="form.kelas" required>
              <option value="">Pilih Kelas</option>
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="matakuliah">Mata Kuliah:</label>
            <select id="matakuliah" v-model="form.matakuliah" required>
              <option value="">Pilih Mata Kuliah</option>
              <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut</option>
              <option value="Basis Data">Basis Data</option>
              <option value="Algoritma">Algoritma</option>
              <option value="Jaringan Komputer">Jaringan Komputer</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="status">Status Kehadiran:</label>
            <select id="status" v-model="form.status" required>
              <option value="">Pilih Status</option>
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="keterangan">Keterangan (Opsional):</label>
            <textarea 
              id="keterangan" 
              v-model="form.keterangan"
              placeholder="Masukkan keterangan tambahan"
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" class="btn-submit">Submit Absensi</button>
        </form>
      </div>
      
      <!-- Daftar Absensi -->
      <div class="absensi-list" v-if="absensiList.length > 0">
        <h2>Daftar Absensi</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Kelas</th>
                <th>Mata Kuliah</th>
                <th>Status</th>
                <th>Waktu</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(absensi, index) in absensiList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ absensi.nama }}</td>
                <td>{{ absensi.nim }}</td>
                <td>{{ absensi.kelas }}</td>
                <td>{{ absensi.matakuliah }}</td>
                <td>
                  <span :class="'status-' + absensi.status.toLowerCase()">
                    {{ absensi.status }}
                  </span>
                </td>
                <td>{{ formatTanggal(absensi.waktu) }}</td>
                <td>{{ absensi.keterangan || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Pesan sukses -->
      <div v-if="showMessage" class="message success">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      form: {
        nama: '',
        nim: '',
        kelas: '',
        matakuliah: '',
        status: '',
        keterangan: ''
      },
      absensiList: [],
      message: '',
      showMessage: false
    }
  },
  methods: {
    submitAbsensi() {
      // Validasi form
      if (!this.form.nama || !this.form.nim || !this.form.kelas || 
          !this.form.matakuliah || !this.form.status) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
      }
      
      // Tambah data absensi
      const absensiData = {
        ...this.form,
        waktu: new Date(),
        id: Date.now()
      };
      
      this.absensiList.push(absensiData);
      
      // Reset form
      this.resetForm();
      
      // Tampilkan pesan sukses
      this.showSuccessMessage('Absensi berhasil disimpan!');
    },
    
    resetForm() {
      this.form = {
        nama: '',
        nim: '',
        kelas: '',
        matakuliah: '',
        status: '',
        keterangan: ''
      };
    },
    
    showSuccessMessage(msg) {
      this.message = msg;
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    },
    
    formatTanggal(date) {
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.absensi-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 2rem;
}

.absensi-form h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.absensi-list {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.absensi-list h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #555;
}

tr:hover {
  background-color: #f5f5f5;
}

.status-hadir {
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.status-izin {
  background-color: #ffc107;
  color: #212529;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.status-sakit {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .absensi-form,
  .absensi-list {
    padding: 1rem;
  }
  
  table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>