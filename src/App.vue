<template>
  <div class="app">
    <!-- Login -->
    <div v-if="!user" class="login-card">
      <h2>📝 Absensi</h2>
      <form @submit.prevent="login">
        <select v-model="loginRole" required>
          <option disabled value="">Pilih Sebagai</option>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="dosen">Dosen</option>
        </select>
        <input v-model="loginName" placeholder="Nama Lengkap" required />
        <button type="submit">Masuk</button>
      </form>
    </div>

    <!-- Main App -->
    <div v-else class="dashboard">
      <div class="navbar">
        <span>👤 {{ user.nama }} ({{ user.role }})</span>
        <button @click="logout">Keluar</button>
      </div>

      <!-- Mahasiswa -->
      <div v-if="user.role === 'mahasiswa'" class="card">
        <h3>📌 Isi Absensi</h3>
        <form @submit.prevent="submitAbsensi">
          <select v-model="absenForm.kehadiran">
            <option>Hadir</option>
            <option>Tidak Hadir</option>
          </select>
          <button type="submit">{{ isEdit ? 'Update' : 'Absen Sekarang' }}</button>
          <button v-if="isEdit" @click="cancelEdit" type="button">Batal</button>
        </form>

        <h3>📋 Riwayat Absensi Saya</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Kehadiran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in absensiSaya" :key="a.id">
              <td>{{ i + 1 }}</td>
              <td>{{ a.kehadiran }}</td>
              <td>
                <button @click="editAbsensi(a)">✏️</button>
                <button @click="hapusAbsensi(a.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dosen -->
      <div v-if="user.role === 'dosen'" class="card">
        <h3>📊 Data Kehadiran Mahasiswa</h3>
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
import { ref, reactive, computed } from 'vue'

const user = ref(null)
const loginName = ref('')
const loginRole = ref('')

const absensi = ref([])

const absenForm = reactive({
  id: null,
  nama: '',
  kehadiran: 'Hadir'
})

const isEdit = ref(false)

function login() {
  user.value = {
    nama: loginName.value.trim(),
    role: loginRole.value
  }
  absenForm.nama = user.value.nama
  loginName.value = ''
  loginRole.value = ''
}

function logout() {
  user.value = null
  resetForm()
}

function submitAbsensi() {
  if (isEdit.value) {
    const idx = absensi.value.findIndex(a => a.id === absenForm.id)
    if (idx !== -1) absensi.value[idx] = { ...absenForm }
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

function editAbsensi(a) {
  absenForm.id = a.id
  absenForm.nama = a.nama
  absenForm.kehadiran = a.kehadiran
  isEdit.value = true
}

function hapusAbsensi(id) {
  absensi.value = absensi.value.filter(a => a.id !== id)
  resetForm()
}

function cancelEdit() {
  isEdit.value = false
  resetForm()
}

function resetForm() {
  absenForm.id = null
  absenForm.kehadiran = 'Hadir'
  absenForm.nama = user.value?.nama || ''
}

const absensiSaya = computed(() =>
  absensi.value.filter(a => a.nama === user.value?.nama)
)
</script>

<style scoped>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
.app {
  font-family: 'Segoe UI', sans-serif;
  padding: 1rem;
  max-width: 800px;
  margin: auto;
  color: #222;
}
h2, h3 {
  margin-top: 0;
  color: #222;
}
.login-card, .card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-top: 2rem;
}
form {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}
input, select, button {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #bbb;
  color: #222;
}
button {
  background-color: #1565c0;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background-color: #0d47a1;
}
.navbar {
  display: flex;
  justify-content: space-between;
  background: #1976d2;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.7rem;
  text-align: center;
}
th {
  background-color: #f1f1f1;
  color: #222;
}
td {
  background-color: #fff;
  color: #222;
}
</style>
