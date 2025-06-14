<template>
  <div class="app">
    <!-- Login Form -->
    <div v-if="!user">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <select v-model="loginRole" required>
          <option disabled value="">Pilih Peran</option>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
        <input v-model="loginName" placeholder="Nama" required />
        <button type="submit">Login</button>
      </form>
    </div>

    <!-- App Content -->
    <div v-else>
      <h2>Selamat Datang, {{ user.nama }} ({{ user.role }})</h2>
      <button @click="logout">Logout</button>

      <div v-if="user.role === 'mahasiswa'">
        <h3>Isi Absensi</h3>
        <form @submit.prevent="submitAbsensi">
          <select v-model="absenForm.kehadiran">
            <option>Hadir</option>
            <option>Tidak Hadir</option>
          </select>
          <button type="submit">{{ isEdit ? 'Update' : 'Absen' }}</button>
          <button v-if="isEdit" @click="cancelEdit" type="button">Batal</button>
        </form>

        <h3>Riwayat Absensi Saya</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Kehadiran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in absensiSaya" :key="a.id">
              <td>{{ i + 1 }}</td>
              <td>{{ a.nama }}</td>
              <td>{{ a.kehadiran }}</td>
              <td>
                <button @click="editAbsensi(a)">Edit</button>
                <button @click="hapusAbsensi(a.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="user.role === 'dosen'">
        <h3>Daftar Kehadiran Semua Mahasiswa</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in absensi" :key="a.id">
              <td>{{ i + 1 }}</td>
              <td>{{ a.nama }}</td>
              <td>{{ a.kehadiran }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// State user login
const user = ref(null)
const loginRole = ref('')
const loginName = ref('')

// Absensi list
const absensi = ref([])

// Form absensi
const absenForm = reactive({
  id: null,
  nama: '',
  kehadiran: 'Hadir'
})

const isEdit = ref(false)

// Login
function login() {
  user.value = {
    nama: loginName.value,
    role: loginRole.value
  }
  loginName.value = ''
  loginRole.value = ''
}

// Logout
function logout() {
  user.value = null
  resetForm()
}

// Tambah Absensi (Create)
function submitAbsensi() {
  if (isEdit.value) {
    const idx = absensi.value.findIndex((a) => a.id === absenForm.id)
    if (idx !== -1) {
      absensi.value[idx] = { ...absenForm }
    }
    isEdit.value = false
  } else {
    absensi.value.push({
      id: Date.now(),
      nama: user.value.nama,
      kehadiran: absenForm.kehadiran
    })
  }
  resetForm()
}

// Edit Absensi
function editAbsensi(a) {
  absenForm.id = a.id
  absenForm.nama = a.nama
  absenForm.kehadiran = a.kehadiran
  isEdit.value = true
}

// Delete Absensi
function hapusAbsensi(id) {
  absensi.value = absensi.value.filter((a) => a.id !== id)
  resetForm()
}

// Batal Edit
function cancelEdit() {
  resetForm()
  isEdit.value = false
}

// Reset form
function resetForm() {
  absenForm.id = null
  absenForm.nama = user.value?.nama || ''
  absenForm.kehadiran = 'Hadir'
}

// Filter absensi milik mahasiswa yang sedang login
const absensiSaya = computed(() =>
  absensi.value.filter((a) => a.nama === user.value?.nama)
)
</script>

<style scoped>
.app {
  max-width: 700px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 1rem;
}

form {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

input, select, button {
  padding: 0.5rem;
  font-size: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}

button {
  cursor: pointer;
}
</style>
