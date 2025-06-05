export default function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`); // URL needs base in Node.js

  if (url.pathname.startsWith("/api/aplikasiabsenfina")) {
    return res.status(200).json([
      {
        id: '1',
        name: "event 1",
        place: "pandaan",
        time: 1741247092,
      },
      {
        id: '2',
        name: "event 2",
        place: "sukorejo",
        time: 1741246092,
      },
      {
        id: '3',
        name: "event 3",
        place: "purwosari",
        time: 1741245092,
      },
    ]);
  }

  res.status(404).json({ error: "Not found" });
}
