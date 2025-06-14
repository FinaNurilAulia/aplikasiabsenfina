const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())

let absensi = []
let currentId = 1

app.post('/login', (req, res) => {
  const { nama, role } = req.body
  if (!nama || !role) return res.status(400).json({ message: 'Nama dan role wajib diisi' })
  res.json({ nama, role })
})

app.get('/absensi', (req, res) => res.json(absensi))

app.get('/absensi/:nama', (req, res) => {
  const data = absensi.filter(a => a.nama.toLowerCase() === req.params.nama.toLowerCase())
  res.json(data)
})

app.post('/absensi', (req, res) => {
  const { nama, kehadiran } = req.body
  if (!nama || !kehadiran) return res.status(400).json({ message: 'Data tidak valid' })
  const item = { id: currentId++, nama, kehadiran }
  absensi.push(item)
  res.status(201).json(item)
})

app.put('/absensi/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = absensi.findIndex(a => a.id === id)
  if (index === -1) return res.status(404).json({ message: 'Tidak ditemukan' })
  absensi[index].kehadiran = req.body.kehadiran
  res.json(absensi[index])
})

app.delete('/absensi/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = absensi.findIndex(a => a.id === id)
  if (index === -1) return res.status(404).json({ message: 'Tidak ditemukan' })
  const deleted = absensi.splice(index, 1)
  res.json(deleted[0])
})

app.listen(PORT, () => console.log(`✅ API aktif di http://localhost:${PORT}`))
