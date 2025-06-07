<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-lg border-b-4 border-indigo-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-3xl font-bold text-gray-900">
                📚 <span class="text-indigo-600">Sistem Absensi</span>
              </h1>
            </div>
          </div>
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
            <span class="text-gray-700">Halo, <strong>{{ currentUser.nama }}</strong></span>
            <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {{ currentUser.role === 'dosen' ? '👨‍🏫 Dosen' : '👨‍🎓 Mahasiswa' }}
            </span>
            <button 
              @click="logout" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Login Form -->
    <div v-if="!isLoggedIn" class="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke Sistem Absensi
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Silakan pilih peran Anda untuk melanjutkan
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="login">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <input
                v-model="loginForm.nama"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <select
                v-model="loginForm.role"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Pilih Role</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="dosen">Dosen</option>
              </select>
            </div>
            <div v-if="loginForm.role === 'mahasiswa'">
              <label class="block text-sm font-medium text-gray-700">NIM</label>
              <input
                v-model="loginForm.nim"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Masukkan NIM Anda"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <a
            v-for="tab in availableTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors',
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </a>
        </nav>
      </div>

      <!-- Absensi Form (Mahasiswa) -->
      <div v-if="activeTab === 'absensi' && currentUser.role === 'mahasiswa'" class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">📝 Form Absensi</h3>
        <form @submit.prevent="submitAbsensi" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <input
                v-model="absensiForm.nama"
                type="text"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">NIM</label>
              <input
                v-model="absensiForm.nim"
                type="text"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Keterangan</label>
            <select
              v-model="absensiForm.keterangan"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Pilih Keterangan</option>
              <option value="hadir">✅ Hadir</option>
              <option value="izin">📝 Izin</option>
              <option value="sakit">🏥 Sakit</option>
              <option value="alpa">❌ Alpa</option>
            </select>
          </div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Submit Absensi' }}
          </button>
        </form>
      </div>

      <!-- Data Absensi -->
      <div v-if="activeTab === 'data'" class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">📊 Data Absensi</h3>
          <button
            @click="fetchAbsensiData"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Refresh Data
          </button>
        </div>

        <!-- Filter dan Search -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari berdasarkan nama atau NIM..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <select
              v-model="filterKeterangan"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>
        </div>

        <!-- Tabel Data -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIM
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th v-if="currentUser.role === 'dosen'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in filteredAbsensiData" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ item.nama }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ item.nim }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.keterangan)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(item.keterangan) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDateTime(item.waktu) }}
                </td>
                <td v-if="currentUser.role === 'dosen'" class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="editAbsensi(item)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    @click="deleteAbsensi(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAbsensiData.length === 0">
                <td :colspan="currentUser.role === 'dosen' ? 5 : 4" class="px-6 py-4 text-center text-gray-500">
                  Tidak ada data absensi
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Statistik (Dosen) -->
      <div v-if="activeTab === 'statistik' && currentUser.role === 'dosen'" class="bg-white shadow-lg rounded-lg p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-6">📈 Statistik Absensi</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="text-green-600 text-2xl mr-3">✅</div>
              <div>
                <p class="text-sm font-medium text-green-600">Hadir</p>
                <p class="text-2xl font-bold text-green-900">{{ getStatusCount('hadir') }}</p>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="text-blue-600 text-2xl mr-3">📝</div>
              <div>
                <p class="text-sm font-medium text-blue-600">Izin</p>
                <p class="text-2xl font-bold text-blue-900">{{ getStatusCount('izin') }}</p>
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="text-yellow-600 text-2xl mr-3">🏥</div>
              <div>
                <p class="text-sm font-medium text-yellow-600">Sakit</p>
                <p class="text-2xl font-bold text-yellow-900">{{ getStatusCount('sakit') }}</p>
              </div>
            </div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="flex items-center">
              <div class="text-red-600 text-2xl mr-3">❌</div>
              <div>
                <p class="text-sm font-medium text-red-600">Alpa</p>
                <p class="text-2xl font-bold text-red-900">{{ getStatusCount('alpa') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Edit Absensi</h3>
        <form @submit.prevent="updateAbsensi">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <input
                v-model="editForm.nama"
                type="text"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">NIM</label>
              <input
                v-model="editForm.nim"
                type="text"
                readonly
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Keterangan</label>
              <select
                v-model="editForm.keterangan"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="hadir">✅ Hadir</option>
                <option value="izin">📝 Izin</option>
                <option value="sakit">🏥 Sakit</option>
                <option value="alpa">❌ Alpa</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.show" 
         :class="[
           'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300',
           notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
         ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      activeTab: 'absensi',
      
      // Login form
      loginForm: {
        nama: '',
        role: '',
        nim: ''
      },
      
      // Absensi form
      absensiForm: {
        nama: '',
        nim: '',
        keterangan: ''
      },
      
      // Edit form
      editForm: {
        id: null,
        nama: '',
        nim: '',
        keterangan: ''
      },
      
      // Data
      absensiData: [],
      
      // UI State
      isSubmitting: false,
      showEditModal: false,
      searchQuery: '',
      filterKeterangan: '',
      
      // Notification
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  
  computed: {
    availableTabs() {
      const tabs = [
        { id: 'data', name: '📊 Data Absensi' }
      ];
      
      if (this.currentUser?.role === 'mahasiswa') {
        tabs.unshift({ id: 'absensi', name: '📝 Form Absensi' });
      }
      
      if (this.currentUser?.role === 'dosen') {
        tabs.push({ id: 'statistik', name: '📈 Statistik' });
      }
      
      return tabs;
    },
    
    filteredAbsensiData() {
      let filtered = this.absensiData;
      
      // Search filter
      if (this.searchQuery) {
        filtered = filtered.filter(item => 
          item.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.nim.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      // Status filter
      if (this.filterKeterangan) {
        filtered = filtered.filter(item => item.keterangan === this.filterKeterangan);
      }
      
      return filtered;
    }
  },
  
  methods: {
    login() {
      if (!this.loginForm.nama || !this.loginForm.role) {
        this.showNotification('Harap lengkapi semua field', 'error');
        return;
      }
      
      if (this.loginForm.role === 'mahasiswa' && !this.loginForm.nim) {
        this.showNotification('NIM harus diisi untuk mahasiswa', 'error');
        return;
      }
      
      this.currentUser = {
        nama: this.loginForm.nama,
        role: this.loginForm.role,
        nim: this.loginForm.nim
      };
      
      this.isLoggedIn = true;
      
      // Set form absensi untuk mahasiswa
      if (this.currentUser.role === 'mahasiswa') {
        this.absensiForm.nama = this.currentUser.nama;
        this.absensiForm.nim = this.currentUser.nim;
        this.activeTab = 'absensi';
      } else {
        this.activeTab = 'data';
      }
      
      this.fetchAbsensiData();
      this.showNotification('Login berhasil!', 'success');
    },
    
    logout() {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.activeTab = 'absensi';
      this.loginForm = { nama: '', role: '', nim: '' };
      this.absensiForm = { nama: '', nim: '', keterangan: '' };
      this.absensiData = [];
    },
    
    async submitAbsensi() {
      if (!this.absensiForm.keterangan) {
        this.showNotification('Pilih keterangan absensi', 'error');
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        // Simulasi tanpa API call - langsung tambah ke data lokal
        const newAbsensi = {
          id: Date.now(),
          nama: this.absensiForm.nama,
          nim: this.absensiForm.nim,
          keterangan: this.absensiForm.keterangan,
          waktu: new Date().toISOString()
        };
        
        this.absensiData.unshift(newAbsensi);
        this.showNotification('Absensi berhasil disimpan!', 'success');
        this.absensiForm.keterangan = '';
      } catch (error) {
        this.showNotification('Terjadi kesalahan saat menyimpan', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    fetchAbsensiData() {
      // Inisialisasi data dummy - tidak menggunakan API call
      if (this.absensiData.length === 0) {
        this.absensiData = [
          {
            id: 1,
            nama: 'John Doe',
            nim: '123456789',
            keterangan: 'hadir',
            waktu: new Date().toISOString()
          },
          {
            id: 2,
            nama: 'Jane Smith',
            nim: '987654321',
            keterangan: 'izin',
            waktu: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            nama: 'Bob Johnson',
            nim: '456789123',
            keterangan: 'sakit',
            waktu: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 4,
            nama: 'Alice Brown',
            nim: '321654987',
            keterangan: 'alpa',
            waktu: new Date(Date.now() - 259200000).toISOString()
          }
        ];
      }
    },
    
    editAbsensi(item) {
      this.editForm = { ...item };
      this.showEditModal = true;
    },
    
    async updateAbsensi() {
      try {
        // Update data lokal tanpa API call
        const index = this.absensiData.findIndex(item => item.id === this.editForm.id);
        if (index !== -1) {
          this.absensiData[index] = { ...this.editForm };
          this.showNotification('Data berhasil diupdate!', 'success');
          this.showEditModal = false;
        } else {
          this.showNotification('Data tidak ditemukan', 'error');
        }
      } catch (error) {
        this.showNotification('Terjadi kesalahan saat mengupdate', 'error');
      }
    },
    
    async deleteAbsensi(id) {
      if (!confirm('Yakin ingin menghapus data ini?')) return;
      
      try {
        // Hapus dari data lokal tanpa API call
        const index = this.absensiData.findIndex(item => item.id === id);
        if (index !== -1) {
          this.absensiData.splice(index, 1);
          this.showNotification('Data berhasil dihapus!', 'success');
        } else {
          this.showNotification('Data tidak ditemukan', 'error');
        }
      } catch (error) {
        this.showNotification('Terjadi kesalahan saat menghapus', 'error');
      }
    },
    
    // Mock API call untuk simulasi
    async mockApiCall(url, method, data = null) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (method === 'GET') {
            resolve({
              success: true,
              data: [
                {
                  id: 1,
                  nama: 'John Doe',
                  nim: '123456789',
                  keterangan: 'hadir',
                  waktu: new Date().toISOString()
                },
                {
                  id: 2,
                  nama: 'Jane Smith',
                  nim: '987654321',
                  keterangan: 'izin',
                  waktu: new Date(Date.now() - 86400000).toISOString()
                },
                {
                  id: 3,
                  nama: 'Bob Johnson',
                  nim: '456789123',
                  keterangan: 'sakit',
                  waktu: new Date(Date.now() - 172800000).toISOString()
                }
              ]
            });
          } else if (method === 'POST') {
            resolve({
              success: true,
              message: 'Absensi berhasil disimpan',
              data: {
                id: Date.now(),
                ...data,
                waktu: new Date().toISOString()
              }
            });
          } else if (method === 'PUT') {
            resolve({
              success: true,
              message: 'Data berhasil diupdate'
            });
          } else if (method === 'DELETE') {
            resolve({
              success: true,
              message: 'Data berhasil dihapus'
            });
          }
        }, 1000);
      });
    },
    
    getStatusClass(status) {
      const classes = {
        'hadir': 'bg-green-100 text-green-800',
        'izin': 'bg-blue-100 text-blue-800',
        'sakit': 'bg-yellow-100 text-yellow-800',
        'alpa': 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    
    getStatusText(status) {
      const texts = {
        'hadir': '✅ Hadir',
        'izin': '📝 Izin',
        'sakit': '🏥 Sakit',
        'alpa': '❌ Alpa'
      };
      return texts[status] || status;
    },
    
    getStatusCount(status) {
      return this.absensiData.filter(item => item.keterangan === status).length;
    },
    
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    showNotification(message, type = 'success') {
      this.notification = {
        show: true,
        message,
        type
      };
      
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>