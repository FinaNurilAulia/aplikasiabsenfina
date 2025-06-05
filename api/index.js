export default {
  async fetch(request, env, ctx) {
    const { method } = request;
    const url = new URL(request.url);

    if (url.pathname === "/api/absen") {
      if (method === "GET") {
        // Contoh data absensi
        const data = [
          {
            id: '1',
            nama: 'Ahmad',
            waktu: 1741247092,
            lokasi: 'Pandaan',
          },
          {
            id: '2',
            nama: 'Budi',
            waktu: 1741246092,
            lokasi: 'Sukorejo',
          },
        ];
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (method === "POST") {
        const body = await request.json();
        const { nama, waktu, lokasi } = body;

        // Di sini Anda bisa tambahkan logika simpan ke KV, database, dsb.
        // Untuk sementara, kita anggap berhasil ditambahkan.
        const newAbsen = {
          id: String(Date.now()),
          nama,
          waktu,
          lokasi,
        };

        return new Response(JSON.stringify({
          message: "Absensi berhasil dicatat.",
          data: newAbsen,
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        });
      }

      return new Response("Method Not Allowed", { status: 405 });
    }

    return new Response("Not Found", { status: 404 });
  }
};
