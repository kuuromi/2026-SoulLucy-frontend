import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void; 
  editData?: any;
  readOnly?: boolean;
}

const BookingModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, editData, readOnly }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userName: '', 
    roomId: '' as string | number, 
    date: '', 
    time: '', 
    purpose: '', 
    status: 'Pending'
  });

  useEffect(() => {
    if (isOpen) {
      bookingService.getRooms().then(res => {
        const data = res.data.$values || res.data;
        setRooms(Array.isArray(data) ? data : []);
      });

      if (editData) {
        setFormData({ 
          userName: editData.userName, 
          roomId: editData.roomId, 
          date: editData.date || '', 
          time: editData.time || '', 
          purpose: editData.purpose || '', 
          status: editData.status 
        });
      } else {
        setFormData({ userName: '', roomId: '', date: '', time: '', purpose: '', status: 'Pending' });
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    try {
      if (editData) {
        await bookingService.update(editData.id, formData);
      } else {
        await bookingService.create(formData);
      }
      onSuccess(); 
      onClose();
    } catch (err) {
      alert("Gagal menyimpan data.");
    }
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    if (readOnly) return "Detail Peminjaman";
    return editData ? "Edit Peminjaman" : "Peminjaman Baru";
  };

  const getModalIcon = () => readOnly ? "📄" : "📅";

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2 style={modalTitle}>
          <span>{getModalIcon()}</span> {getModalTitle()}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={label}>Nama Peminjam</label>
            <input 
              style={input} 
              placeholder="Nama Lengkap" 
              value={formData.userName} 
              required 
              disabled={readOnly}
              onChange={e => setFormData({...formData, userName: e.target.value})} 
            />
          </div>

          <div style={formGroup}>
            <label style={label}>Pilih Ruangan</label>
            <select 
              style={input} 
              value={formData.roomId} 
              required 
              disabled={readOnly}
              onChange={e => setFormData({...formData, roomId: Number(e.target.value)})}
            >
              <option value="">-- Pilih Ruangan --</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id} style={{color: '#333'}}>
                  {r.name} ({r.capacity} Orang)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Tanggal</label>
              <input 
                type="date" 
                style={input} 
                value={formData.date} 
                required 
                disabled={readOnly}
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Waktu</label>
              <input 
                type="time" 
                style={input} 
                value={formData.time} 
                required 
                disabled={readOnly}
                onChange={e => setFormData({...formData, time: e.target.value})} 
              />
            </div>
          </div>

          <div style={formGroup}>
            <label style={label}>Keperluan</label>
            <textarea 
              style={{ ...input, height: '80px', resize: 'none' }} 
              placeholder="Tujuan Peminjaman" 
              value={formData.purpose} 
              required 
              disabled={readOnly}
              onChange={e => setFormData({...formData, purpose: e.target.value})} 
            />
          </div>

          {!readOnly ? (
            <>
              <button type="submit" style={btnSubmit}>
                {editData ? "Simpan Perubahan" : "Simpan Booking"}
              </button>
              <button type="button" onClick={onClose} style={btnCancel}>Batal</button>
            </>
          ) : (
            <button type="button" onClick={onClose} style={{...btnSubmit, backgroundColor: '#667eea'}}>
              Tutup
            </button>
          )}
        </form>
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
  marginBottom: '25px', fontSize: '22px', fontWeight: 700, 
  color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px'
};

const formGroup = { marginBottom: '18px' };
const label = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: '#666' };
const input = { 
  width: '100%', padding: '12px 15px', backgroundColor: '#f8f9ff', 
  border: '2px solid #e0e7ff', borderRadius: '12px', color: '#333', 
  outline: 'none', boxSizing: 'border-box' as const, fontSize: '14px' 
};
const btnSubmit = { 
  backgroundColor: '#4caf50', color: 'white', padding: '16px', 
  width: '100%', border: 'none', borderRadius: '12px', fontWeight: 700, 
  cursor: 'pointer', fontSize: '16px', marginTop: '10px' 
};
const btnCancel = { 
  marginTop: '15px', width: '100%', background: 'none', color: '#888', 
  border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 
};

export default BookingModal;