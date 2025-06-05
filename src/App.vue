<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Absensi Mahasiswa</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }

        .header p {
            color: #666;
            font-size: 1.1rem;
        }

        .nav-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
            justify-content: center;
        }

        .nav-tab {
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .nav-tab:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .nav-tab.active {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .stat-card:nth-child(2) {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }

        .stat-card:nth-child(3) {
            background: linear-gradient(135deg, #45b7d1, #96c93d);
        }

        .stat-card:nth-child(4) {
            background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e1e8ed;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
        }

        .btn-warning {
            background: linear-gradient(135deg, #feca57, #ff9ff3);
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .table th, .table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        .table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }

        .table tbody tr:hover {
            background: #f8f9fa;
        }

        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .badge-success {
            background: #d4edda;
            color: #155724;
        }

        .alert {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid;
        }

        .alert-success {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }

        .alert-danger {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .nav-tabs {
                flex-wrap: wrap;
            }
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="container">
            <div class="header">
                <h1><i class="fas fa-graduation-cap"></i> Sistem Absensi Mahasiswa</h1>
                <p>Platform digital untuk manajemen kehadiran mahasiswa</p>
            </div>

            <!-- Navigation Tabs -->
            <div class="nav-tabs">
                <button class="nav-tab" :class="{ active: activeTab === 'dashboard' }" @click="activeTab = 'dashboard'">
                    <i class="fas fa-chart-line"></i> Dashboard
                </button>
                <button class="nav-tab" :class="{ active: activeTab === 'absensi' }" @click="activeTab = 'absensi'">
                    <i class="fas fa-clipboard-check"></i> Absensi
                </button>
                <button class="nav-tab" :class="{ active: activeTab === 'mahasiswa' }" @click="activeTab = 'mahasiswa'">
                    <i class="fas fa-users"></i> Data Mahasiswa
                </button>
            </div>

            <!-- Dashboard Tab -->
            <div v-if="activeTab === 'dashboard'">
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.total_mahasiswa }}</div>
                        <div class="stat-label">Total Mahasiswa</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.hadir_hari_ini }}</div>
                        <div class="stat-label">Hadir Hari Ini</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.total_absensi }}</div>
                        <div class="stat-label">Total Absensi</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{{ stats.persentase_kehadiran }}%</div>
                        <div class="stat-label">Persentase Kehadiran</div>
                    </div>
                </div>

                <!-- Absensi Hari Ini -->
                <div class="card">
                    <h3><i class="fas fa-calendar-day"></i> Absensi Hari Ini</h3>
                    <div v-if="absensiHariIni.length === 0" class="empty-state">
                        <i class="fas fa-calendar-times fa-3x"></i>
                        <p>Belum ada mahasiswa yang absen hari ini</p>
                    </div>
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>NIM</th>
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Mata Kuliah</th>
                                <th>Waktu</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="abs in absensiHariIni" :key="abs.id">
                                <td>{{ abs.mahasiswa?.nim }}</td>
                                <td>{{ abs.mahasiswa?.nama }}</td>
                                <td>{{ abs.mahasiswa?.kelas }}</td>
                                <td>{{ abs.mata_kuliah }}</td>
                                <td>{{ abs.waktu }}</td>
                                <td><span class="badge badge-success">{{ abs.status }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Absensi Tab -->
            <div v-if="activeTab === 'absensi'">
                <!-- Form Check-in -->
                <div class="card">
                    <h3><i class="fas fa-sign-in-alt"></i> Check-in Absensi</h3>
                    
                    <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                    </div>

                    <form @submit.prevent="checkIn">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Pilih Mahasiswa</label>
                                <select v-model="absensiForm.mahasiswa_id" class="form-control" required>
                                    <option value="">-- Pilih Mahasiswa --</option>
                                    <option v-for="mhs in mahasiswaList" :key="mhs.id" :value="mhs.id">
                                        {{ mhs.nim }} - {{ mhs.nama }} ({{ mhs.kelas }})
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Mata Kuliah</label>
                                <select v-model="absensiForm.mata_kuliah" class="form-control" required>
                                    <option value="">-- Pilih Mata Kuliah --</option>
                                    <option value="Pemrograman Web">Pemrograman Web</option>
                                    <option value="Database">Database</option>
                                    <option value="Algoritma">Algoritma</option>
                                    <option value="Jaringan Komputer">Jaringan Komputer</option>
                                    <option value="Sistem Operasi">Sistem Operasi</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-success" :disabled="loading">
                            <i class="fas fa-check"></i>
                            {{ loading ? 'Processing...' : 'Check-in Absensi' }}
                        </button>
                    </form>
                </div>

                <!-- Riwayat Absensi -->
                <div class="card">
                    <h3><i class="fas fa-history"></i> Riwayat Absensi</h3>
                    <div v-if="absensiList.length === 0" class="empty-state">
                        <i class="fas fa-clipboard-list fa-3x"></i>
                        <p>Belum ada data absensi</p>
                    </div>
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>NIM</th>
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Mata Kuliah</th>
                                <th>Waktu</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="abs in absensiList" :key="abs.id">
                                <td>{{ formatDate(abs.tanggal) }}</td>
                                <td>{{ abs.mahasiswa?.nim }}</td>
                                <td>{{ abs.mahasiswa?.nama }}</td>
                                <td>{{ abs.mahasiswa?.kelas }}</td>
                                <td>{{ abs.mata_kuliah }}</td>
                                <td>{{ abs.waktu }}</td>
                                <td><span class="badge badge-success">{{ abs.status }}</span></td>
                                <td>
                                    <button @click="deleteAbsensi(abs.id)" class="btn btn-danger" style="padding: 8px 12px;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mahasiswa Tab -->
            <div v-if="activeTab === 'mahasiswa'">
                <!-- Form Mahasiswa -->
                <div class="card">
                    <h3><i class="fas fa-user-plus"></i> {{ editMode ? 'Edit' : 'Tambah' }} Mahasiswa</h3>
                    
                    <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                    </div>

                    <form @submit.prevent="saveMahasiswa">
                        <div class="form-row">
                            <div class="form-group">
                                <label>NIM</label>
                                <input type="text" v-model="mahasiswaForm.nim" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" v-model="mahasiswaForm.nama" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Kelas</label>
                                <select v-model="mahasiswaForm.kelas" class="form-control" required>
                                    <option value="">-- Pilih Kelas --</option>
                                    <option value="TI-3A">TI-3A</option>
                                    <option value="TI-3B">TI-3B</option>
                                    <option value="TI-3C">TI-3C</option>
                                    <option value="SI-3A">SI-3A</option>
                                    <option value="SI-3B">SI-3B</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" v-model="mahasiswaForm.email" class="form-control" required>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <i class="fas fa-save"></i>
                                {{ loading ? 'Menyimpan...' : (editMode ? 'Update' : 'Simpan') }}
                            </button>
                            <button v-if="editMode" type="button" @click="cancelEdit" class="btn btn-warning">
                                <i class="fas fa-times"></i> Batal
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Daftar Mahasiswa -->
                <div class="card">
                    <h3><i class="fas fa-list"></i> Daftar Mahasiswa</h3>
                    <div v-if="mahasiswaList.length === 0" class="empty-state">
                        <i class="fas fa-users fa-3x"></i>
                        <p>Belum ada data mahasiswa</p>
                    </div>
                    <table v-else class="table">
                        <thead>
                            <tr>
                                <th>NIM</th>
                                <th>Nama</th>
                                <th>Kelas</th>
                                <th>Email</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>