<template>
  <div id="app">
    <!-- Header -->
    <div class="header">
      <h1>
        <i class="icon">🕐</i>
        Sistem Absensi Karyawan
      </h1>
      <p>Kelola absensi karyawan dengan mudah</p>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button 
        @click="activeTab = 'employee'" 
        :class="{ active: activeTab === 'employee' }"
        class="tab-button"
      >
        👥 Panel Karyawan
      </button>
      <button 
        @click="activeTab = 'hrd'" 
        :class="{ active: activeTab === 'hrd' }"
        class="tab-button"
      >
        📊 Panel HRD
      </button>
    </div>

    <!-- Employee Panel -->
    <div v-if="activeTab === 'employee'" class="panel">
      <h2>Panel Karyawan - Absensi Harian</h2>
      
      <div class="employee-list">
        <div 
          v-for="employee in employees" 
          :key="employee.id" 
          class="employee-card"
        >
          <div class="employee-info">
            <h3>{{ employee.name }}</h3>
            <p>NIP: {{ employee.nip }} | {{ employee.position }}</p>
            <div v-if="getTodayAttendance(employee.id)" class="attendance-info">
              <span class="time-in">
                Masuk: {{ formatTime(getTodayAttendance(employee.id).clockIn) }}
              </span>
              <span 
                v-if="getTodayAttendance(employee.id).clockOut" 
                class="time-out"
              >
                Keluar: {{ formatTime(getTodayAttendance(employee.id).clockOut) }}
              </span>
            </div>
          </div>
          
          <div class="attendance-actions">
            <button 
              v-if="!getTodayAttendance(employee.id)"
              @click="clockIn(employee.id)"
              class="btn btn-success"
            >
              ✅ Absen Masuk
            </button>
            <button 
              v-else-if="!getTodayAttendance(employee.id).clockOut"
              @click="clockOut(getTodayAttendance(employee.id).id)"
              class="btn btn-danger"
            >
              ❌ Absen Keluar
            </button>
            <span v-else class="completed">
              ✅ Absen Lengkap
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- HRD Panel -->
    <div v-if="activeTab === 'hrd'" class="panel">
      <h2>Panel HRD - Manajemen Data</h2>
      
      <!-- Add Employee Form -->
      <div class="form-section">
        <h3>➕ Tambah Karyawan Baru</h3>
        <form @submit.prevent="addEmployee" class="form-grid">
          <input 
            v-model="newEmployee.name" 
            type="text" 
            placeholder="Nama Lengkap" 
            required
          >
          <input 
            v-model="newEmployee.nip" 
            type="text" 
            placeholder="NIP" 
            required
          >
          <input 
            v-model="newEmployee.position" 
            type="text" 
            placeholder="Jabatan" 
            required
          >
          <button type="submit" class="btn btn-primary">Tambah</button>
        </form>
      </div>

      <!-- Employee List Table -->
      <div class="table-section">
        <h3>Daftar Karyawan</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIP</th>
              <th>Jabatan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>
                <input 
                  v-if="editingEmployee?.id === employee.id"
                  v-model="editingEmployee.name"
                  type="text"
                  class="edit-input"
                >
                <span v-else>{{ employee.name }}</span>
              </td>
              <td>
                <input 
                  v-if="editingEmployee?.id === employee.id"
                  v-model="editingEmployee.nip"
                  type="text"
                  class="edit-input"
                >
                <span v-else>{{ employee.nip }}</span>
              </td>
              <td>
                <input 
                  v-if="editingEmployee?.id === employee.id"
                  v-model="editingEmployee.position"
                  type="text"
                  class="edit-input"
                >
                <span v-else>{{ employee.position }}</span>
              </td>
              <td class="actions">
                <div v-if="editingEmployee?.id === employee.id">
                  <button @click="updateEmployee" class="btn btn-sm btn-success">💾</button>
                  <button @click="editingEmployee = null" class="btn btn-sm btn-secondary">❌</button>
                </div>
                <div v-else>
                  <button @click="editingEmployee = { ...employee }" class="btn btn-sm btn-warning">✏️</button>
                  <button @click="deleteEmployee(employee.id)" class="btn btn-sm btn-danger">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Date Filter -->
      <div class="filter-section">
        <label for="dateFilter">Pilih Tanggal:</label>
        <input 
          id="dateFilter"
          v-model="selectedDate" 
          type="date" 
          class="date-input"
        >
      </div>

      <!-- Attendance Table -->
      <div class="table-section">
        <h3>Data Absensi - {{ formatDate(selectedDate) }}</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Karyawan</th>
              <th>Jam Masuk</th>
              <th>Jam Keluar</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attendance in getAttendancesByDate(selectedDate)" :key="attendance.id">
              <td>{{ getEmployeeName(attendance.employeeId) }}</td>
              <td>
                <input 
                  v-if="editingAttendance?.id === attendance.id"
                  v-model="editingAttendance.clockIn"
                  type="time"
                  class="edit-input"
                >
                <span v-else>{{ formatTime(attendance.clockIn) }}</span>
              </td>
              <td>
                <input 
                  v-if="editingAttendance?.id === attendance.id"
                  v-model="editingAttendance.clockOut"
                  type="time"
                  class="edit-input"
                >
                <span v-else>{{ formatTime(attendance.clockOut) }}</span>
              </td>
              <td>
                <span :class="attendance.clockOut ? 'status-complete' : 'status-incomplete'">
                  {{ attendance.clockOut ? 'Lengkap' : 'Belum Keluar' }}
                </span>
              </td>
              <td class="actions">
                <div v-if="editingAttendance?.id === attendance.id">
                  <button @click="updateAttendance" class="btn btn-sm btn-success">💾</button>
                  <button @click="editingAttendance = null" class="btn btn-sm btn-secondary">❌</button>
                </div>
                <div v-else>
                  <button @click="editingAttendance = { ...attendance }" class="btn btn-sm btn-warning">✏️</button>
                  <button @click="deleteAttendance(attendance.id)" class="btn btn-sm btn-danger">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="getAttendancesByDate(selectedDate).length === 0" class="no-data">
          Tidak ada data absensi untuk tanggal ini
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceApp',
  data() {
    return {
      activeTab: 'employee',
      employees: [
        { id: 1, name: 'Ahmad Setiawan', nip: 'EMP001', position: 'Developer' },
        { id: 2, name: 'Siti Nurhaliza', nip: 'EMP002', position: 'Designer' },
        { id: 3, name: 'Budi Prasetyo', nip: 'EMP003', position: 'Manager' }
      ],
      attendances: [],
      editingEmployee: null,
      editingAttendance: null,
      newEmployee: { name: '', nip: '', position: '' },
      selectedDate: new Date().toISOString().split('T')[0]
    };
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    formatTime(timeString) {
      if (!timeString) return '-';
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    clockIn(employeeId) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
      
      const existingAttendance = this.attendances.find(
        att => att.employeeId === employeeId && att.date === today
      );

      if (existingAttendance) {
        alert('Anda sudah absen masuk hari ini!');
        return;
      }

      const newAttendance = {
        id: Date.now(),
        employeeId,
        date: today,
        clockIn: currentTime,
        clockOut: null,
        status: 'present'
      };

      this.attendances.push(newAttendance);
      alert('Berhasil absen masuk!');
    },
    
    clockOut(attendanceId) {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
      
      const attendanceIndex = this.attendances.findIndex(att => att.id === attendanceId);
      if (attendanceIndex !== -1) {
        this.attendances[attendanceIndex].clockOut = currentTime;
        alert('Berhasil absen keluar!');
      }
    },
    
    addEmployee() {
      if (!this.newEmployee.name || !this.newEmployee.nip || !this.newEmployee.position) {
        alert('Semua field harus diisi!');
        return;
      }

      const employee = {
        id: Date.now(),
        ...this.newEmployee
      };
      
      this.employees.push(employee);
      this.newEmployee = { name: '', nip: '', position: '' };
      alert('Karyawan berhasil ditambahkan!');
    },
    
    updateEmployee() {
      const index = this.employees.findIndex(emp => emp.id === this.editingEmployee.id);
      if (index !== -1) {
        this.employees[index] = { ...this.editingEmployee };
        this.editingEmployee = null;
        alert('Data karyawan berhasil diupdate!');
      }
    },
    
    deleteEmployee(id) {
      if (confirm('Yakin ingin menghapus karyawan ini?')) {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.attendances = this.attendances.filter(att => att.employeeId !== id);
        alert('Karyawan berhasil dihapus!');
      }
    },
    
    deleteAttendance(id) {
      if (confirm('Yakin ingin menghapus data absensi ini?')) {
        this.attendances = this.attendances.filter(att => att.id !== id);
        alert('Data absensi berhasil dihapus!');
      }
    },
    
    updateAttendance() {
      const index = this.attendances.findIndex(att => att.id === this.editingAttendance.id);
      if (index !== -1) {
        this.attendances[index] = { ...this.editingAttendance };
        this.editingAttendance = null;
        alert('Data absensi berhasil diupdate!');
      }
    },
    
    getAttendancesByDate(date) {
      return this.attendances.filter(att => att.date === date);
    },
    
    getEmployeeName(employeeId) {
      const employee = this.employees.find(emp => emp.id === employeeId);
      return employee ? employee.name : 'Unknown';
    },
    
    getTodayAttendance(employeeId) {
      const today = new Date().toISOString().split('T')[0];
      return this.attendances.find(att => att.employeeId === employeeId && att.date === today);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  text-align: center;
}

.header h1 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.header .icon {
  margin-right: 15px;
}

.header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 1.1em;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 20px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 500;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #ecf0f1;
}

.tab-button.active {
  background: #3498db;
  color: white;
}

.panel {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.panel h2 {
  color: #2c3e50;
  margin: 0 0 30px 0;
  font-size: 2em;
}

.panel h3 {
  color: #34495e;
  margin: 0 0 20px 0;
  font-size: 1.3em;
}

.employee-list {
  display: grid;
  gap: 20px;
}

.employee-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #3498db;
}

.employee-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.employee-info p {
  margin: 0 0 10px 0;
  color: #7f8c8d;
}

.attendance-info {
  display: flex;
  gap: 20px;
  font-size: 0.9em;
}

.time-in {
  color: #27ae60;
  font-weight: 500;
}

.time-out {
  color: #e74c3c;
  font-weight: 500;
}

.attendance-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  font-size: 0.9em;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.8em;
}

.completed {
  color: #27ae60;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 15px;
  align-items: end;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-grid input {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1em;
}

.form-grid input:focus {
  outline: none;
  border-color: #3498db;
}

.table-section {
  margin-bottom: 30px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.data-table th {
  background: #34495e;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

.data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ecf0f1;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.edit-input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.actions {
  text-align: center;
}

.actions > div {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.date-input {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1em;
}

.date-input:focus {
  outline: none;
  border-color: #3498db;
}

.status-complete {
  background: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.status-incomplete {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .employee-card {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .data-table {
    font-size: 0.8em;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>