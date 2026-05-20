const { exec } = require('child_process');

async function test() {
  console.log('Starting localtunnel for port 3001...');
  const lt = exec('npx localtunnel --port 3001');
  
  lt.stdout.on('data', async (data) => {
    const match = data.match(/your url is: (https:\/\/.+\.loca\.lt)/);
    if (match) {
      const url = match[1];
      console.log('Tunnel URL:', url);
      
      try {
        console.log('Fetching random doc...');
        const res = await fetch(url + '/api/documents/nonexistent', {
          headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });
        console.log('Status:', res.status);
        console.log('Body:', await res.text());
        
        console.log('Fetching real doc (y615pix3)...');
        const res2 = await fetch(url + '/api/documents/y615pix3', {
          headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });
        console.log('Status:', res2.status);
        console.log('Body:', await res2.text());
        
      } catch (err) {
        console.error('Fetch error:', err.message);
      }
      process.exit(0);
    }
  });
}
test();
