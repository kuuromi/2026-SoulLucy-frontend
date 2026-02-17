import React from 'react';
import { X } from 'lucide-react';

interface DetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const DetailModal: React.FC<DetailProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={modalTitle}><span>📄</span> Detail Peminjaman</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}>
             <X size={24} />
          </button>
        </div>

        <div style={formGroup}>
          <label style={label}>Nama Peminjam</label>
          <div style={readOnlyInput}>{data.userName}</div>
        </div>

        <div style={formGroup}>
          <label style={label}>Ruangan</label>
          <div style={readOnlyInput}>{data.roomName}</div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Tanggal</label>
            <div style={readOnlyInput}>{data.date || '-'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Waktu</label>
            <div style={readOnlyInput}>{data.time || '-'}</div>
          </div>
        </div>

        <div style={formGroup}>
          <label style={label}>Keperluan</label>
          <div style={{ ...readOnlyInput, height: 'auto', minHeight: '80px' }}>{data.purpose || '-'}</div>
        </div>

        <div style={formGroup}>
          <label style={label}>Status</label>
          <div style={{ ...readOnlyInput, fontWeight: 700, color: data.status === 'Approved' ? '#4caf50' : '#ff9800' }}>
            {data.status}
          </div>
        </div>

        <button onClick={onClose} style={btnOk}>Tutup</button>
      </div>
    </div>
  );
};

const modalOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

const modalContent: React.CSSProperties = {
  backgroundColor: 'white', padding: '35px', borderRadius: '24px',
  width: '450px', color: '#333', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
  fontFamily: "'Poppins', sans-serif"
};

const modalTitle: React.CSSProperties = {
  fontSize: '22px', fontWeight: 700, color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px'
};

const formGroup = { marginBottom: '18px' };
const label = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#666' };
const readOnlyInput = { 
  width: '100%', padding: '12px 15px', backgroundColor: '#f8f9ff', 
  border: '2px solid #e0e7ff', borderRadius: '12px', color: '#333', fontSize: '14px',
  boxSizing: 'border-box' as const
};
const btnOk = { 
  backgroundColor: '#667eea', color: 'white', padding: '14px', width: '100%', 
  border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '16px', marginTop: '10px' 
};

export default DetailModal;