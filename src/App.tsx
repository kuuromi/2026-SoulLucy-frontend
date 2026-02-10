import { useState, useEffect } from 'react'
import { bookingService } from './services/api'
import BookingModal from './components/BookingModal'
import { 
  LayoutDashboard, Users, Clock, Trophy, Search, 
  CheckCircle, Edit, Trash2, Monitor, Coffee, 
  School, Theater, ChevronDown, Eye, Sparkles 
} from 'lucide-react'

function App() {
  const [peminjam, setPeminjam] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
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

  const fetchRooms = () => {
    bookingService.getRooms().then(res => {
      const data = res.data.$values || res.data;
      setRooms(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => { 
    fetchBookings(); 
    fetchRooms();
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const getDynamicStatus = (roomName: string) => {
    const isBooked = peminjam.some(p => 
      (p.roomName || '').toLowerCase() === (roomName || '').toLowerCase() && 
      (p.status === 'Approved' || p.status === 'Pending')
    );
    return isBooked ? 'In Use' : 'Available';
  };

  const handleShowDetail = (item: any) => {
    alert(`📄 DETAIL PEMINJAMAN\n\nNama: ${item.userName}\nRuangan: ${item.roomName}\nTanggal: ${item.date || '-'}\nWaktu: ${item.time || '-'}\nKeperluan: ${item.purpose || '-'}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Yakin ingin menghapus data ini?")) {
      await bookingService.delete(id);
      fetchBookings();
    }
  };

  const handleApprove = async (id: number) => {
    await bookingService.updateStatus(id, { status: 'Approved' });
    fetchBookings();
  };

  const filteredData = peminjam.filter(item => {
    const matchSearch = (item.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (item.roomName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getRoomIcon = (name: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('lab')) return <Monitor size={18} color="#667eea" />;
    if (n.includes('theater')) return <Theater size={18} color="#667eea" />;
    if (n.includes('aula') || n.includes('auditorium')) return <School size={18} color="#667eea" />;
    return <Coffee size={18} color="#667eea" />;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Poppins', sans-serif", padding: '20px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', backgroundColor: '#f8f9ff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>

        <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '10px' }}>
              <LayoutDashboard size={22} color="#667eea" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700 }}>SoulLucy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Rosalia</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>Administrator</div>
            </div>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
        </header>

        <section style={{ padding: '30px 40px 10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={statCardStyle('#667eea')}>
            <div style={statIconStyle('#e8eaff')}><LayoutDashboard size={24} color="#667eea" /></div>
            <div style={statLabelStyle}>Total Booking</div>
            <div style={statValueStyle('#333')}>{peminjam.length}</div>
          </div>
          <div style={statCardStyle('#ff9800')}>
            <div style={statIconStyle('#fff3e0')}><Clock size={24} color="#ff9800" /></div>
            <div style={statLabelStyle}>Pending Approval</div>
            <div style={statValueStyle('#ff9800')}>{peminjam.filter(p => p.status === 'Pending').length}</div>
          </div>
          <div style={statCardStyle('#4caf50')}>
            <div style={statIconStyle('#e8f5e9')}><Trophy size={24} color="#4caf50" /></div>
            <div style={statLabelStyle}>Ruangan Terlaris</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>Auditorium</div>
          </div>
        </section>

        <section style={{ padding: '20px 40px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>🏢 Manajemen Ruangan</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '12px' 
          }}>
            {rooms.map(room => {
              const currentStatus = getDynamicStatus(room.name);
              return (
                <div key={room.id} style={roomCardStyleCompact}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ fontWeight: 700, color: '#333', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{room.name}</div>
                    {getRoomIcon(room.name)}
                  </div>

                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Sparkles size={10} color="#ff9800" style={{ marginTop: '2px' }} />
                    <div style={{ color: '#777', fontSize: '10px', lineHeight: '1.4', fontWeight: 400 }}>
                      {room.facilities || 'Fasilitas Standar'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={roomStatusStyleCompact(currentStatus)}>{currentStatus}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555', fontSize: '11px', fontWeight: 700 }}>
                      <Users size={12} color="#888" /> {room.capacity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ padding: '20px 40px 40px' }}>
          <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>📋 Riwayat Peminjaman</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', maxWidth: '1200px' }}>
            <div style={{ position: 'relative', flex: 3 }}>
              <Search style={{ position: 'absolute', left: '15px', top: '13px', color: '#667eea' }} size={18} />
              <input placeholder="Cari nama mahasiswa atau ruangan..." style={inputStyle} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <select style={selectStyle} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All" style={{color: '#333'}}>📊 Semua Status</option>
                <option value="Pending" style={{color: '#333'}}>⏳ Pending</option>
                <option value="Approved" style={{color: '#333'}}>✅ Approved</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: '15px', top: '13px', color: '#667eea', pointerEvents: 'none' }} size={18} />
            </div>
            <button onClick={() => { setBookingToEdit(null); setIsModalOpen(true); }} style={btnMainStyle}>+ Booking Baru</button>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Peminjam</th>
                  <th style={thStyle}>Ruangan</th>
                  <th style={thStyle}>Tanggal</th>
                  <th style={thStyle}>Waktu</th>
                  <th style={thStyle}>Keperluan</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={tdStyle}>#{idx + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{item.userName}</td>
                    <td style={tdStyle}>{item.roomName}</td>
                    <td style={tdStyle}>{item.date || '-'}</td>
                    <td style={tdStyle}>{item.time || '-'}</td>
                    <td style={tdStyle}>{item.purpose || '-'}</td>
                    <td style={tdStyle}><span style={statusBadgeStyle(item.status)}>{item.status}</span></td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleShowDetail(item)} style={btnIconStyle('#2196f3')} title="Detail"><Eye size={16} /></button>
                        {item.status === 'Pending' && (
                          <button onClick={() => handleApprove(item.id)} style={btnIconStyle('#4caf50')} title="Approve"><CheckCircle size={16} /></button>
                        )}
                        <button onClick={() => {setBookingToEdit(item); setIsModalOpen(true);}} style={btnIconStyle('#ff9800')} title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} style={btnIconStyle('#f44336')} title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchBookings} editData={bookingToEdit} />
    </div>
  )
}

const roomCardStyleCompact = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '12px 16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  border: '1px solid #f0f0f0',
  display: 'flex',
  flexDirection: 'column' as const,
  minHeight: '110px'
};

const roomStatusStyleCompact = (s: string) => ({
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: '12px',
  fontSize: '9px',
  fontWeight: 800,
  backgroundColor: s === 'Available' ? '#e8f5e9' : '#ffebee',
  color: s === 'Available' ? '#4caf50' : '#f44336',
  textTransform: 'uppercase' as const
});

const statCardStyle = (color: string) => ({ backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderLeft: `4px solid ${color}` });
const statIconStyle = (bg: string) => ({ width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', backgroundColor: bg });
const statLabelStyle = { color: '#666', fontSize: '14px', fontWeight: 500 };
const statValueStyle = (c: string) => ({ fontSize: '32px', fontWeight: 700, color: c });
const inputStyle = { width: '100%', padding: '12px 15px 12px 45px', border: '2px solid #e0e7ff', borderRadius: '12px', outline: 'none', fontSize: '14px', backgroundColor: 'white', color: '#333' };
const selectStyle = { width: '100%', padding: '12px 40px 12px 15px', border: '2px solid #e0e7ff', borderRadius: '12px', outline: 'none', backgroundColor: 'white', fontSize: '14px', cursor: 'pointer', appearance: 'none' as const, color: '#333' };
const btnMainStyle = { backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '14px 25px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' };
const thStyle = { padding: '15px', textAlign: 'left' as const, fontSize: '14px', fontWeight: 600 };
const tdStyle = { padding: '15px', fontSize: '14px', color: '#333' };
const statusBadgeStyle = (s: string) => ({ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, backgroundColor: s === 'Approved' ? '#e8f5e9' : '#fff3e0', color: s === 'Approved' ? '#4caf50' : '#ff9800' });
const btnIconStyle = (bg: string) => ({ backgroundColor: bg, color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' });

export default App;