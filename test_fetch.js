async function test() {
  const res = await fetch("http://localhost:3005/api/research/etsy-native", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword: "t-shirt" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
