<template>
  <div id="app">
    <div class="container">
      <!-- Header -->
      <header class="app-header">
        <h1>Sistem Absensi Kampus</h1>
        <div class="user-toggle">
          <button 
            @click="userRole = 'mahasiswa'" 
            :class="{ active: userRole === 'mahasiswa' }"
            class="role-btn"
          >
            Mahasiswa
          </button>
          <button 
            @click="userRole = 'dosen'" 
            :class="{ active: userRole === 'dosen' }"
            class="role-btn"
          >
            Dosen
          </button>
        </div>
      </header>

      <!-- View Mahasiswa -->
      <div v-if="userRole === 'mahasiswa'" class="mahasiswa-view">
        <div class="form-section">
          <h2>{{ editingId ? 'Edit Absensi' : 'Form Absensi Mahasiswa' }}</h2>
          <form @submit.prevent="submitAbsensi" class="absensi-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nama">Nama Lengkap:</label>
                <input 
                  type="text" 
                  id="nama" 
                  v-model="form.nama" 
                  required
                  placeholder="Masukkan nama lengkap"
                >
              </div>
              
              <div class="form-group">
                <label for="nim">NIM:</label>
                <input 
                  type="text" 
                  id="nim" 
                  v-model="form.nim" 
                  required
                  placeholder="Masukkan NIM"
                  :disabled="editingId"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="kelas">Kelas:</label>
                <select id="kelas" v-model="form.kelas" required>
                  <option value="">Pilih Kelas</option>
                  <option value="TI-A">TI-A</option>
                  <option value="TI-B">TI-B</option>
                  <option value="TI-C">TI-C</option>
                  <option value="SI-A">SI-A</option>
                  <option value="SI-B">SI-B</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="semester">Semester:</label>
                <select id="semester" v-model="form.semester" required>
                  <option value="">Pilih Semester</option>
                  <option v-for="i in 8" :key="i" :value="i">Semester {{ i }}</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="matakuliah">Mata Kuliah:</label>
                <select id="matakuliah" v-model="form.matakuliah" required>
                  <option value="">Pilih Mata Kuliah</option>
                  <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut</option>
                  <option value="Basis Data">Basis Data</option>
                  <option value="Algoritma dan Struktur Data">Algoritma dan Struktur Data</option>
                  <option value="Jaringan Komputer">Jaringan Komputer</option>
                  <option value="Sistem Operasi">Sistem Operasi</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="status">Status Kehadiran:</label>
                <select id="status" v-model="form.status" required>
                  <option value="">Pilih Status</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpha">Alpha</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="keterangan">Keterangan:</label>
              <textarea 
                id="keterangan" 
                v-model="form.keterangan"
                placeholder="Masukkan keterangan (opsional untuk Hadir, wajib untuk Izin/Sakit)"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{ editingId ? 'Update Absensi' : 'Submit Absensi' }}
              </button>
              <button 
                v-if="editingId" 
                type="button" 
                @click="cancelEdit" 
                class="btn-secondary"
              >
                Batal Edit
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Dosen -->
      <div v-if="userRole === 'dosen'" class="dosen-view">
        <div class="dosen-controls">
          <h2>Dashboard Dosen</h2>
          <div class="filter-controls">
            <div class="filter-group">
              <label>Filter Mata Kuliah:</label>
              <select v-model="filterMatkul">
                <option value="">Semua Mata Kuliah</option>
                <option value="Pemrograman Web Lanjut">Pemrograman Web Lanjut</option>
                <option value="Basis Data">Basis Data</option>
                <option value="Algoritma dan Struktur Data">Algoritma dan Struktur Data</option>
                <option value="Jaringan Komputer">Jaringan Komputer</option>
                <option value="Sistem Operasi">Sistem Operasi</option>
                <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Filter Kelas:</label>
              <select v-model="filterKelas">
                <option value="">Semua Kelas</option>
                <option value="TI-A">TI-A</option>
                <option value="TI-B">TI-B</option>
                <option value="TI-C">TI-C</option>
                <option value="SI-A">SI-A</option>
                <option value="SI-B">SI-B</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Filter Status:</label>
              <select v-model="filterStatus">
                <option value="">Semua Status</option>
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="Alpha">Alpha</option>
              </select>
            </div>
          </div>
          
          <div class="stats-cards">
            <div class="stat-card">
              <h3>Total Mahasiswa</h3>
              <p class="stat-number">{{ totalMahasiswa }}</p>
            </div>
            <div class="stat-card hadir">
              <h3>Hadir</h3>
              <p class="stat-number">{{ statsHadir }}</p>
            </div>
            <div class="stat-card izin">
              <h3>Izin</h3>
              <p class="stat-number">{{ statsIzin }}</p>
            </div>
            <div class="stat-card sakit">
              <h3>Sakit</h3>
              <p class="stat-number">{{ statsSakit }}</p>
            </div>
            <div class="stat-card alpha">
              <h3>Alpha</h3>
              <p class="stat-number">{{ statsAlpha }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Absensi (untuk kedua role) -->
      <div class="table-section">
        <div class="table-header">
          <h2>
            {{ userRole === 'dosen' ? 'Data Absensi Mahasiswa' : 'Riwayat Absensi Anda' }}
          </h2>
          <div class="table-actions">
            <button @click="exportData" class="btn-export">Export Excel</button>
            <button v-if="userRole === 'dosen'" @click="clearAllData" class="btn-danger">
              Hapus Semua Data
            </button>
          </div>
        </div>
        
        <div v-if="filteredAbsensiList.length === 0" class="no-data">
          <p>Belum ada data absensi.</p>
        </div>
        
        <div v-else class="table-container">
          <table class="absensi-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIM</th>
                <th>Kelas</th>
                <th>Semester</th>
                <th>Mata Kuliah</th>
                <th>Status</th>
                <th>Waktu</th>
                <th>Keterangan</th>
                <th v-if="userRole === 'mahasiswa'">Aksi</th>
                <th v-if="userRole === 'dosen'">Aksi Dosen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(absensi, index) in paginatedData" :key="absensi.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>{{ absensi.nama }}</td>
                <td>{{ absensi.nim }}</td>
                <td>{{ absensi.kelas }}</td>
                <td>{{ absensi.semester }}</td>
                <td>{{ absensi.matakuliah }}</td>
                <td>
                  <span :class="'status-badge status-' + absensi.status.toLowerCase()">
                    {{ absensi.status }}
                  </span>
                </td>
                <td>{{ formatTanggal(absensi.waktu) }}</td>
                <td>{{ absensi.keterangan || '-' }}</td>
                <td v-if="userRole === 'mahasiswa'">
                  <div class="action-buttons">
                    <button @click="editAbsensi(absensi)" class="btn-edit">Edit</button>
                    <button @click="deleteAbsensi(absensi.id)" class="btn-delete">Hapus</button>
                  </div>
                </td>
                <td v-if="userRole === 'dosen'">
                  <div class="action-buttons">
                    <button @click="verifyAbsensi(absensi.id)" class="btn-verify">
                      {{ absensi.verified ? 'Verified ✓' : 'Verify' }}
                    </button>
                    <button @click="deleteAbsensi(absensi.id)" class="btn-delete">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
              class="page-btn"
            >
              First
            </button>
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="page-btn"
            >
              Previous
            </button>
            <span class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              Next
            </button>
            <button 
              @click="currentPage = totalPages" 
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              Last
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal Konfirmasi -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h3>{{ modalTitle }}</h3>
          <p>{{ modalMessage }}</p>
          <div class="modal-actions">
            <button @click="confirmAction" class="btn-primary">Ya</button>
            <button @click="closeModal" class="btn-secondary">Batal</button>
          </div>
        </div>
      </div>
      
      <!-- Toast Notification -->
      <div v-if="showToast" :class="'toast toast-' + toastType">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      userRole: 'mahasiswa', // 'mahasiswa' atau 'dosen'
      editingId: null,
      form: {
        nama: '',
        nim: '',
        kelas: '',
        semester: '',
        matakuliah: '',
        status: '',
        keterangan: ''
      },
      absensiList: [],
      filterMatkul: '',
      filterKelas: '',
      filterStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalAction: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success'
    }
  },
  computed: {
    filteredAbsensiList() {
      let filtered = this.absensiList;
      
      if (this.filterMatkul) {
        filtered = filtered.filter(item => item.matakuliah === this.filterMatkul);
      }
      
      if (this.filterKelas) {
        filtered = filtered.filter(item => item.kelas === this.filterKelas);
      }
      
      if (this.filterStatus) {
        filtered = filtered.filter(item => item.status === this.filterStatus);
      }
      
      return filtered.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
    },
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAbsensiList.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredAbsensiList.length / this.itemsPerPage);
    },
    
    totalMahasiswa() {
      return this.filteredAbsensiList.length;
    },
    
    statsHadir() {
      return this.filteredAbsensiList.filter(item => item.status === 'Hadir').length;
    },
    
    statsIzin() {
      return this.filteredAbsensiList.filter(item => item.status === 'Izin').length;
    },
    
    statsSakit() {
      return this.filteredAbsensiList.filter(item => item.status === 'Sakit').length;
    },
    
    statsAlpha() {
      return this.filteredAbsensiList.filter(item => item.status === 'Alpha').length;
    }
  },
  
  methods: {
    submitAbsensi() {
      // Validasi form
      if (!this.validateForm()) {
        return;
      }
      
      if (this.editingId) {
        this.updateAbsensi();
      } else {
        this.createAbsensi();
      }
    },
    
    validateForm() {
      if (!this.form.nama || !this.form.nim || !this.form.kelas || 
          !this.form.semester || !this.form.matakuliah || !this.form.status) {
        this.showToastMessage('Mohon lengkapi semua field yang wajib diisi!', 'error');
        return false;
      }
      
      // Validasi keterangan untuk status Izin dan Sakit
      if ((this.form.status === 'Izin' || this.form.status === 'Sakit') && !this.form.keterangan.trim()) {
        this.showToastMessage('Keterangan wajib diisi untuk status Izin atau Sakit!', 'error');
        return false;
      }
      
      // Cek duplikat NIM untuk mata kuliah yang sama di hari yang sama (hanya saat create)
      if (!this.editingId) {
        const today = new Date().toDateString();
        const duplicate = this.absensiList.find(item => 
          item.nim === this.form.nim && 
          item.matakuliah === this.form.matakuliah &&
          new Date(item.waktu).toDateString() === today
        );
        
        if (duplicate) {
          this.showToastMessage('Anda sudah melakukan absensi untuk mata kuliah ini hari ini!', 'error');
          return false;
        }
      }
      
      return true;
    },
    
    createAbsensi() {
      const absensiData = {
        id: Date.now(),
        ...this.form,
        waktu: new Date(),
        verified: false
      };
      
      this.absensiList.push(absensiData);
      this.resetForm();
      this.showToastMessage('Absensi berhasil disimpan!', 'success');
      this.saveToLocalStorage();
    },
    
    updateAbsensi() {
      const index = this.absensiList.findIndex(item => item.id === this.editingId);
      if (index !== -1) {
        this.absensiList[index] = {
          ...this.absensiList[index],
          ...this.form,
          updatedAt: new Date()
        };
        
        this.cancelEdit();
        this.showToastMessage('Absensi berhasil diupdate!', 'success');
        this.saveToLocalStorage();
      }
    },
    
    editAbsensi(absensi) {
      this.editingId = absensi.id;
      this.form = {
        nama: absensi.nama,
        nim: absensi.nim,
        kelas: absensi.kelas,
        semester: absensi.semester,
        matakuliah: absensi.matakuliah,
        status: absensi.status,
        keterangan: absensi.keterangan || ''
      };
      
      // Scroll ke form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    cancelEdit() {
      this.editingId = null;
      this.resetForm();
    },
    
    deleteAbsensi(id) {
      this.modalTitle = 'Konfirmasi Hapus';
      this.modalMessage = 'Apakah Anda yakin ingin menghapus data absensi ini?';
      this.modalAction = () => {
        this.absensiList = this.absensiList.filter(item => item.id !== id);
        this.showToastMessage('Data absensi berhasil dihapus!', 'success');
        this.saveToLocalStorage();
        this.closeModal();
      };
      this.showModal = true;
    },
    
    verifyAbsensi(id) {
      const index = this.absensiList.findIndex(item => item.id === id);
      if (index !== -1) {
        this.absensiList[index].verified = !this.absensiList[index].verified;
        this.showToastMessage(
          this.absensiList[index].verified ? 'Absensi berhasil diverifikasi!' : 'Verifikasi absensi dibatalkan!', 
          'success'
        );
        this.saveToLocalStorage();
      }
    },
    
    clearAllData() {
      this.modalTitle = 'Konfirmasi Hapus Semua';
      this.modalMessage = 'Apakah Anda yakin ingin menghapus SEMUA data absensi? Tindakan ini tidak dapat dibatalkan!';
      this.modalAction = () => {
        this.absensiList = [];
        this.showToastMessage('Semua data absensi berhasil dihapus!', 'success');
        this.saveToLocalStorage();
        this.closeModal();
      };
      this.showModal = true;
    },
    
    exportData() {
      if (this.filteredAbsensiList.length === 0) {
        this.showToastMessage('Tidak ada data untuk diekspor!', 'error');
        return;
      }
      
      // Simulasi export (dalam implementasi nyata, gunakan library seperti xlsx)
      const csvContent = this.generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `absensi_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.showToastMessage('Data berhasil diekspor!', 'success');
    },
    
    generateCSV() {
      const headers = ['No', 'Nama', 'NIM', 'Kelas', 'Semester', 'Mata Kuliah', 'Status', 'Waktu', 'Keterangan', 'Verified'];
      const rows = this.filteredAbsensiList.map((item, index) => [
        index + 1,
        item.nama,
        item.nim,
        item.kelas,
        item.semester,
        item.matakuliah,
        item.status,
        this.formatTanggal(item.waktu),
        item.keterangan || '-',
        item.verified ? 'Ya' : 'Tidak'
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    },
    
    resetForm() {
      this.form = {
        nama: '',
        nim: '',
        kelas: '',
        semester: '',
        matakuliah: '',
        status: '',
        keterangan: ''
      };
    },
    
    closeModal() {
      this.showModal = false;
      this.modalAction = null;
    },
    
    confirmAction() {
      if (this.modalAction) {
        this.modalAction();
      }
    },
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    
    formatTanggal(date) {
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
      }).format(new Date(date));
    },
    
    saveToLocalStorage() {
      localStorage.setItem('absensiData', JSON.stringify(this.absensiList));
    },
    
    loadFromLocalStorage() {
      const saved = localStorage.getItem('absensiData');
      if (saved) {
        this.absensiList = JSON.parse(saved);
      }
    }
  },
  
  mounted() {
    this.loadFromLocalStorage();
  },
  
  watch: {
    userRole() {
      this.currentPage = 1;
      this.filterMatkul = '';
      this.filterKelas = '';
      this.filterStatus = '';
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styles */
.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
}

.app-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.user-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.role-btn {
  padding: 0.75rem 2rem;
  border: 2px solid white;
  background: transparent;
  color: white;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.role-btn:hover,
.role-btn.active {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Form Styles */
.form-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.form-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
}

.absensi-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* Button Styles */
.btn-primary,
.btn-secondary,
.btn-export,
.btn-danger,
.btn-edit,
.btn-delete,
.btn-verify {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.btn-export {
  background: #28a745;
  color: white;
}

.btn-export:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-edit {
  background: #17a2b8;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-edit:hover {
  background: #138496;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-delete:hover {
  background: #c82333;
}

.btn-verify {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-verify:hover {
  background: #218838;
}

/* Dosen View Styles */
.dosen-controls {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0