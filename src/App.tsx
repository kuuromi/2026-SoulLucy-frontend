import { useState, useEffect } from 'react'
import { getBookings } from './services/api'

function App() {
  const [peminjam, setPeminjam] = useState<any[]>([]);

useEffect(() => {
  console.log("Mencoba mengambil data...");
  getBookings()
    .then(data => {
      console.log("Data mentah dari API:", data); // Lihat ini di F12
      
      // ASP.NET sering membungkus array di dalam properti $values
      let finalData = [];
      if (Array.isArray(data)) {
        finalData = data;
      } else if (data && data.$values && Array.isArray(data.$values)) {
        finalData = data.$values;
      } else if (data && typeof data === 'object') {
        // Jika data hanya satu objek, masukkan ke array
        finalData = [data];
      }

      console.log("Data yang diproses untuk tabel:", finalData);
      setPeminjam(finalData);
    })
    .catch(err => {
      console.error("Gagal konek ke Backend. Cek apakah Visual Studio sudah di-F5!", err);
    });
}, []);

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
      <h1>SoulLucy Dashboard</h1>
      <hr />
      <h3>Riwayat Peminjaman (Data Real):</h3>

      <table border={1} style={{ width: '100%', marginTop: '20px', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#333' }}>
          <tr>
            <th style={{ padding: '10px' }}>User</th>
            <th style={{ padding: '10px' }}>Ruangan</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {peminjam.length === 0 ? (
            <tr><td colSpan={3} style={{ padding: '10px' }}>Sedang memuat data...</td></tr>
          ) : (
            peminjam.map((item: any) => (
              <tr key={item.id}>
                <td style={{ padding: '10px' }}>{item.userName}</td>
                <td style={{ padding: '10px' }}>{item.room?.name || "Executive Meeting Rooms"}</td>
                <td style={{ padding: '10px', color: item.status === 'Approved' ? '#4CAF50' : 'white' }}>
                  {item.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App