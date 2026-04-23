async function test() {
  // Test backend en 3002
  try {
    const res = await fetch('http://localhost:3002/api/software');
    const json = await res.json();
    const items = json?.data ?? json;
    console.log('✅ Backend (3002) responde:', items.length, 'software');
  } catch (e) {
    console.error('❌ Backend (3002) error:', e.message);
  }

  // Test noticias en 3002
  try {
    const res = await fetch('http://localhost:3002/api/noticias');
    const json = await res.json();
    const items = json?.data ?? json;
    console.log('✅ Noticias (3002) responde:', items.length, 'noticias');
  } catch (e) {
    console.error('❌ Noticias (3002) error:', e.message);
  }

  // Test frontend en 3000
  try {
    const res = await fetch('http://localhost:3000/');
    console.log('✅ Frontend (3000) responde:', res.status);
  } catch (e) {
    console.error('❌ Frontend (3000) error:', e.message);
  }
}
test();
