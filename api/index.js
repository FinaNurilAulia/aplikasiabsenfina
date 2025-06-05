let data = [
  { id: '1', nama: 'Ahmad', waktu: 1741247092, lokasi: 'Pandaan' },
  { id: '2', nama: 'Budi', waktu: 1741246092, lokasi: 'Sukorejo' },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // GET all
    if (path === "/api/absen" && method === "GET") {
      return Response.json(data);
    }

    // CREATE
    if (path === "/api/absen" && method === "POST") {
      const body = await request.json();
      const newAbsen = {
        id: Date.now().toString(),
        nama: body.nama,
        lokasi: body.lokasi,
        waktu: body.waktu
      };
      data.push(newAbsen);
      return Response.json({ message: "Ditambahkan", data: newAbsen }, { status: 201 });
    }

    // UPDATE
    if (path.startsWith("/api/absen/") && method === "PUT") {
      const id = path.split("/").pop();
      const body = await request.json();
      data = data.map(item => item.id === id ? { ...item, ...body } : item);
      return Response.json({ message: "Diperbarui" });
    }

    // DELETE
    if (path.startsWith("/api/absen/") && method === "DELETE") {
      const id = path.split("/").pop();
      data = data.filter(item => item.id !== id);
      return Response.json({ message: "Dihapus" });
    }

    return new Response("Not Found", { status: 404 });
  }
};
