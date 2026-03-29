export async function syncData() {
  const localData = await window.api.getSubmissions();

  await fetch("http://localhost:5001/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(localData)
  });
}