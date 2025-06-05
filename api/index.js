addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/aplikasiabsenfina")) {
    return new Response(JSON.stringify([
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
    ]), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  return new Response("Not found", { status: 404 });
}
