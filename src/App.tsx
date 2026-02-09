import { useState, useEffect } from 'react'
import { bookingService } from './services/api'
import BookingModal from './components/BookingModal'

function App() {
  const [peminjam, setPeminjam] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchBookings = () => {
    bookingService.getAll().then(res => {
      const data = res.data.$values || res.data;
      setPeminjam(Array.isArray(data) ? data : []);
    }).catch(err => console.error("Gagal fetch bookings:", err));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleEdit = (item: any) => {
    setBookingToEdit(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus data peminjaman ini?")) {
      await bookingService.delete(id);
      fetchBookings();
    }
  };

  const handleApprove = async (id: number) => {
    await bookingService.updateStatus(id, { status: 'Approved' });
    fetchBookings();
  };

  const filteredData = peminjam.filter(item => {
    const matchSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw', 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: '40px',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        width: '100%'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}>
            SoulLucy Dashboard
          </h1>
          <p style={{ color: '#888', marginTop: '5px' }}>Sistem Manajemen Peminjaman Ruangan</p>
        </div>
        <button 
          onClick={() => { setBookingToEdit(null); setIsModalOpen(true); }} 
          style={{ backgroundColor: '#198754', color: 'white', padding: '14px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          + Buat Peminjaman Baru
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px', 
        backgroundColor: '#1e1e1e', 
        padding: '25px', 
        borderRadius: '16px',
        border: '1px solid #333'
      }}>
        <input 
          placeholder="Cari nama mahasiswa atau ruangan..." 
          style={{ flex: 4, padding: '14px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '8px', fontSize: '16px' }} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select 
          style={{ flex: 1, padding: '14px', backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #444', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      <div style={{ 
        backgroundColor: '#1e1e1e', 
        borderRadius: '16px', 
        overflow: 'hidden',
        border: '1px solid #333',
        width: '100%' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#2a2a2a', textAlign: 'left', borderBottom: '2px solid #333' }}>
              <th style={{ padding: '20px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>Nama</th>
              <th style={{ padding: '20px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>Ruangan</th>
              <th style={{ padding: '20px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '20px', fontSize: '14px', color: '#aaa', textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #333', transition: '0.3s' }}>
                <td style={{ padding: '20px', fontWeight: '500' }}>{item.userName}</td>
                <td style={{ padding: '20px', color: '#ccc' }}>{item.roomName}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: item.status === 'Approved' ? 'rgba(6, 78, 59, 0.5)' : 'rgba(69, 26, 3, 0.5)',
                    color: item.status === 'Approved' ? '#34d399' : '#fbbf24',
                    border: `1px solid ${item.status === 'Approved' ? '#064e3b' : '#451a03'}`
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '20px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(item)} style={{ backgroundColor: '#f59e0b', color: 'black', marginRight: '10px', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                  {item.status === 'Pending' && (
                    <button onClick={() => handleApprove(item.id)} style={{ backgroundColor: '#3b82f6', color: 'white', marginRight: '10px', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Approve</button>
                  )}
                  <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Hapus</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: '50px', textAlign: 'center', color: '#666', fontSize: '18px' }}>Belum ada data peminjaman.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBookings} 
        editData={bookingToEdit} 
      />
    </div>
  )
}

export default App;