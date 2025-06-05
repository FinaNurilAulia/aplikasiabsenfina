<script setup>
import { ref, computed, onMounted } from 'vue';

// Data pengguna
const currentUser = ref({
  name: "Admin",
  role: "Administrator",
  avatar: null
});

// Status login
const isLoggedIn = ref(false);

// Data tanggal dan waktu
const currentDate = ref(new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));
const currentTime = ref('');

// Data absensi
const attendanceData = ref([
  { id: 1, name: 'Budi Santoso', date: '2025-04-24', checkIn: '08:02', checkOut: '17:05', status: 'present', notes: '' },
  { id: 2, name: 'Dewi Lestari', date: '2025-04-24', checkIn: '08:30', checkOut: '17:10', status: 'late', notes: 'Terlambat karena macet' },
  { id: 3, name: 'Andi Wijaya', date: '2025-04-24', checkIn: '07:55', checkOut: '17:05', status: 'present', notes: '' },
  { id: 4, name: 'Siti Nuraini', date: '2025-04-24', checkIn: '08:15', checkOut: '16:45', status: 'present', notes: '' },
  { id: 5, name: 'Rudi Hartono', date: '2025-04-24', checkIn: '', checkOut: '', status: 'leave', notes: 'Cuti tahunan' },
  { id: 6, name: 'Ani Sulistiawati', date: '2025-04-23', checkIn: '08:05', checkOut: '17:00', status: 'present', notes: '' },
  { id: 7, name: 'Bambang Priambodo', date: '2025-04-23', checkIn: '07:50', checkOut: '17:15', status: 'present', notes: '' },
  { id: 8, name: 'Citra Anggraini', date: '2025-04-23', checkIn: '08:45', checkOut: '17:00', status: 'late', notes: 'Bus terlambat' },
]);

// Statistik absensi
const attendanceStats = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const todayData = attendanceData.value.filter(item => item.date === '2025-04-24');
  
  return {
    present: todayData.filter(item => item.status === 'present').length,
    late: todayData.filter(item => item.status === 'late').length,
    absent: todayData.filter(item => item.status === 'absent').length,
    leave: todayData.filter(item => item.status === 'leave').length
  };
});

// Panel aktif
const activePanel = ref('dashboard'); // dashboard, attendance, check-in

// Login form
const username = ref('');
const password = ref('');
const loginError = ref('');

// Fungsi login
const handleLogin = () => {
  if (username.value === '' || password.value === '') {
    loginError.value = 'Username dan password harus diisi';
    return;
  }
  
  // Demo login, dalam implementasi nyata akan validasi ke server
  isLoggedIn.value = true;
  loginError.value = '';
};

// Fungsi logout
const handleLogout = () => {
  isLoggedIn.value = false;
  username.value = '';
  password.value = '';
};

// Fungsi untuk mengubah panel aktif
const changePanel = (panel) => {
  activePanel.value = panel;
};

// Fungsi untuk update waktu
const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

// Check-in form
const newAttendance = ref({
  name: '',
  status: 'present',
  notes: ''
});

// Fungsi untuk menambah data absensi
const submitAttendance = () => {
  if (!newAttendance.value.name) {
    alert('Nama karyawan harus diisi');
    return;
  }
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  
  // Buat ID baru
  const newId = Math.max(...attendanceData.value.map(item => item.id), 0) + 1;
  
  // Tambahkan absensi baru
  attendanceData.value.unshift({
    id: newId,
    name: newAttendance.value.name,
    date: today,
    checkIn: time,
    checkOut: '',
    status: newAttendance.value.status,
    notes: newAttendance.value.notes
  });
  
  // Reset form
  newAttendance.value = {
    name: '',
    status: 'present',
    notes: ''
  };
  
  // Beralih ke panel absensi
  activePanel.value = 'attendance';
};

// Filter tabel absensi
const searchQuery = ref('');
const filterDate = ref('2025-04-24');
const filterStatus = ref('all');

// Data absensi setelah difilter
const filteredAttendance = computed(() => {
  return attendanceData.value.filter(item => {
    const matchName = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchDate = filterDate.value === 'all' || item.date === filterDate.value;
    const matchStatus = filterStatus.value === 'all' || item.status === filterStatus.value;
    
    return matchName && matchDate && matchStatus;
  });
});

// Setup inisialisasi
onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000);
});
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!isLoggedIn" class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <span class="logo-icon">⏱️</span>
          <h1>AttendEase</h1>
        </div>
        <p>Sistem Manajemen Absensi</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="loginError" class="error-message">
          {{ loginError }}
        </div>
        
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Masukkan username" 
            autocomplete="off"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Masukkan password"
          />
        </div>
        
        <button type="submit" class="btn-login">
          Login
        </button>
      </form>
    </div>
  </div>
  
  <!-- Main App -->
  <div v-else class="app-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">⏱️</span>
          <h1>AttendEase</h1>
        </div>
        <div class="user-info">
          <div class="avatar">
            {{ currentUser.name.charAt(0) }}
          </div>
          <div class="user-details">
            <h3>{{ currentUser.name }}</h3>
            <p>{{ currentUser.role }}</p>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li @click="changePanel('dashboard')" :class="{ active: activePanel === 'dashboard' }">
            <span class="icon">📊</span>
            <span>Dashboard</span>
          </li>
          <li @click="changePanel('attendance')" :class="{ active: activePanel === 'attendance' }">
            <span class="icon">📋</span>
            <span>Daftar Absensi</span>
          </li>
          <li @click="changePanel('check-in')" :class="{ active: activePanel === 'check-in' }">
            <span class="icon">✅</span>
            <span>Absen Masuk/Keluar</span>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <span class="icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Dashboard Panel -->
        <div v-if="activePanel === 'dashboard'" class="dashboard">
          <div class="dashboard-header">
            <div>
              <h1 class="dashboard-title">Dashboard</h1>
              <p class="dashboard-subtitle">Selamat datang kembali, {{ currentUser.name }}</p>
            </div>
            <div class="date-time">
              <div class="date">{{ currentDate }}</div>
              <div class="time">{{ currentTime }}</div>
            </div>
          </div>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-icon present">👨‍💼</div>
              <div class="stat-details">
                <span class="stat-value">{{ attendanceStats.present }}</span>
                <span class="stat-label">Hadir</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon absent">🏠</div>
              <div class="stat-details">
                <span class="stat-value">{{ attendanceStats.absent }}</span>
                <span class="stat-label">Tidak Hadir</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon late">⏰</div>
              <div class="stat-details">
                <span class="stat-value">{{ attendanceStats.late }}</span>
                <span class="stat-label">Terlambat</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon leave">📝</div>
              <div class="stat-details">
                <span class="stat-value">{{ attendanceStats.leave }}</span>
                <span class="stat-label">Izin</span>
              </div>
            </div>
          </div>
          
          <div class="dashboard-row">
            <div class="dashboard-card activity-feed">
              <h2 class="card-title">Aktivitas Terbaru</h2>
              <div class="activity-list">
                <div v-for="activity in attendanceData.slice(0, 5)" :key="activity.id" class="activity-item">
                  <div class="activity-icon" :class="activity.status">
                    <span v-if="activity.status === 'present'">✓</span>
                    <span v-else-if="activity.status === 'late'">⏰</span>
                    <span v-else-if="activity.status === 'leave'">📝</span>
                    <span v-else>✗</span>
                  </div>
                  <div class="activity-details">
                    <div class="activity-name">{{ activity.name }}</div>
                    <div class="activity-type">
                      {{ activity.status === 'present' ? 'Hadir' : 
                         activity.status === 'late' ? 'Terlambat' : 
                         activity.status === 'leave' ? 'Izin' : 'Tidak Hadir' }}
                    </div>
                  </div>
                  <div class="activity-time">{{ activity.checkIn || '—' }}</div>
                  <div class="activity-status" :class="activity.status">
                    {{ activity.status === 'present' ? 'Tepat Waktu' : 
                       activity.status === 'late' ? 'Terlambat' : 
                       activity.status === 'leave' ? 'Izin' : 'Absen' }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="dashboard-card quick-actions">
              <h2 class="card-title">Aksi Cepat</h2>
              <div class="actions-grid">
                <button class="action-btn check-in" @click="changePanel('check-in')">
                  <span class="action-icon">↘️</span>
                  <span>Absen Masuk</span>
                </button>
                
                <button class="action-btn check-out" @click="changePanel('check-in')">
                  <span class="action-icon">↗️</span>
                  <span>Absen Keluar</span>
                </button>
                
                <button class="action-btn request-leave" @click="changePanel('check-in')">
                  <span class="action-icon">📝</span>
                  <span>Ajukan Izin</span>
                </button>
                
                <button class="action-btn view-report" @click="changePanel('attendance')">
                  <span class="action-icon">📊</span>
                  <span>Lihat Laporan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Attendance List Panel -->
        <div v-if="activePanel === 'attendance'" class="attendance-list">
          <div class="panel-header">
            <h1 class="panel-title">Daftar Absensi</h1>
            <p class="panel-subtitle">Kelola data absensi karyawan</p>
          </div>
          
          <div class="filters">
            <div class="filter-group">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Cari nama karyawan..." 
                class="search-input"
              />
            </div>
            
            <div class="filter-row">
              <div class="filter-group">
                <label>Tanggal:</label>
                <select v-model="filterDate" class="filter-select">
                  <option value="all">Semua Tanggal</option>
                  <option value="2025-04-24">24 April 2025</option>
                  <option value="2025-04-23">23 April 2025</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>Status:</label>
                <select v-model="filterStatus" class="filter-select">
                  <option value="all">Semua Status</option>
                  <option value="present">Hadir</option>
                  <option value="late">Terlambat</option>
                  <option value="absent">Tidak Hadir</option>
                  <option value="leave">Izin</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="table-container">
            <table class="attendance-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Jam Keluar</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredAttendance" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ new Date(item.date).toLocaleDateString('id-ID') }}</td>
                  <td>{{ item.checkIn || '—' }}</td>
                  <td>{{ item.checkOut || '—' }}</td>
                  <td>
                    <span class="status-badge" :class="item.status">
                      {{ item.status === 'present' ? 'Hadir' : 
                         item.status === 'late' ? 'Terlambat' : 
                         item.status === 'leave' ? 'Izin' : 'Tidak Hadir' }}
                    </span>
                  </td>
                  <td>{{ item.notes || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Check In Panel -->
        <div v-if="activePanel === 'check-in'" class="check-in-panel">
          <div class="panel-header">
            <h1 class="panel-title">Absensi</h1>
            <p class="panel-subtitle">Catat kehadiran atau izin karyawan</p>
          </div>
          
          <div class="card">
            <h2 class="card-title">Form Absensi</h2>
            
            <form @submit.prevent="submitAttendance">
              <div class="form-group">
                <label for="employee-name">Nama Karyawan</label>
                <input 
                  type="text" 
                  id="employee-name" 
                  v-model="newAttendance.name" 
                  placeholder="Masukkan nama karyawan"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="attendance-status">Status Kehadiran</label>
                <select id="attendance-status" v-model="newAttendance.status">
                  <option value="present">Hadir</option>
                  <option value="late">Terlambat</option>
                  <option value="leave">Izin</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="attendance-notes">Catatan (opsional)</label>
                <textarea 
                  id="attendance-notes" 
                  v-model="newAttendance.notes" 
                  placeholder="Masukkan catatan jika diperlukan"
                  rows="3"
                ></textarea>
              </div>
              
              <div class="current-time-display">
                Waktu saat ini: <strong>{{ currentTime }}</strong>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-primary">Simpan Absensi</button>
                <button type="button" class="btn-secondary" @click="activePanel = 'dashboard'">Batal</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #4f46e5;
  --primary-light: #818cf8;
  --primary-dark: #3730a3;
  --secondary-color: #10b981;
  --background-light: #f3f4f6;
  --background-dark: #111827;
  --text-light: #f9fafb;
  --text-dark: #1f2937;
  --danger: #ef4444;
  --warning: #f59e0b;
  --success: #10b981;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body {
  background-color: var(--background-light);
  color: var(--text-dark);
}

/* Login Screen */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo h1 {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.login-header p {
  color: #6b7280;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.form-group input, 
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-login {
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-login:hover {
  background-color: var(--primary-dark);
}

.error-message {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Main App Layout */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: var(--primary-dark);
  color: var(--text-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header .logo {
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-details h3 {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.user-details p {
  font-size: 0.8rem;
  opacity: 0.8;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav li {
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-nav li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav li.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid var(--secondary-color);
}

.icon {
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  color: var(--text-light);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--background-light);
}

.content-wrapper {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  min-height: calc(100vh - 3rem);
}

/* Dashboard Header */
.dashboard-header,
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-title,
.panel-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.3rem;
}

.dashboard-subtitle,
.panel-subtitle {
  color: #6b7280;
}

.date-time {
  text-align: right;
}

.date {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.time {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* Stats Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  border: 1px solid #f3f4f6;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.present {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.stat-icon.absent {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.stat-icon.late {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.stat-icon.leave {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.stat-details {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Dashboard Row Layout */
.dashboard-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

/* Activity Feed */
.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
}

.activity-icon.present {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.activity-icon.absent {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.activity-icon.late {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.activity-icon.leave {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.activity-details {
  flex: 1;
}

.activity-name {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.activity-type {
  font-size: 0.8rem;
  color: #6b7280;
}

.activity-time {
  font-weight: 500;
  margin-right: 1rem;
}

.activity-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-status.present {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.activity-status.absent {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.activity-status.late {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.activity-status.leave {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f3f4f6;
}

.action-icon {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
}

.action-btn.check-in {
  background-color: rgba(16, 185, 129, 0.05);
  color: var(--success);
}

.action-btn.check-out {
  background-color: rgba(245, 158, 11, 0.05);
  color: var(--warning);
}

.action-btn.request-leave {
  background-color: rgba(79, 70, 229, 0.05);
  color: var(--primary-color);
}

.action-btn.view-report {
  background-color: rgba(17, 24, 39, 0.05);
  color: var(--text-dark);
}

.action-btn:hover {
  transform: translateY(-5px);
}

/* Attendance List Panel */
.filters {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.attendance-table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.attendance-table tr:hover {
  background-color: #f9fafb;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.present {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.status-badge.absent {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.status-badge.late {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.status-badge.leave {
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

/* Check In Panel */
.card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  max-width: 600px;
  margin: 0 auto;
}

.current-time-display {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: var(--border-radius);
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  flex: 1;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.btn-secondary {
  background-color: white;
  color: var(--text-dark);
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .sidebar .logo h1,
  .sidebar .user-details,
  .sidebar li span:not(.icon),
  .logout-btn span:not(.icon) {
    display: none;
  }
  
  .sidebar-nav li {
    justify-content: center;
    padding: 1rem 0;
  }
  
  .logout-btn {
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
  }
  
  .dashboard-header,
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-time {
    margin-top: 1rem;
    text-align: left;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
} 
</style>