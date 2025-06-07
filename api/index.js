
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request untuk submit absensi
    const { nama, nim, keterangan } = req.body;
    
    // Validasi data
    if (!nama || !nim || !keterangan) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak lengkap'
      });
    }
    
    // Simpan ke database (contoh sederhana)
    const absensiData = {
      id: Date.now(),
      nama,
      nim,
      keterangan,
      waktu: new Date().toISOString()
    };
    
    return res.status(200).json({
      success: true,
      message: 'Absensi berhasil disimpan',
      data: absensiData
    });
    
  } else if (req.method === 'GET') {
    // Handle GET request untuk mengambil data absensi
    // Contoh data dummy
    const dummyData = [
      {
        id: 1,
        nama: 'John Doe',
        nim: '123456789',
        keterangan: 'hadir',
        waktu: new Date().toISOString()
      }
    ];
    
    return res.status(200).json({
      success: true,
      data: dummyData
    });
    
  } else {
    // Method tidak diizinkan
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan`
    });
  }
}