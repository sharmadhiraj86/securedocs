async function test() {
  try {
    const res = await fetch('http://localhost:3001//api/documents/test');
    console.log('Status with double slash:', res.status);
    console.log('Body:', await res.text());
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
test();
