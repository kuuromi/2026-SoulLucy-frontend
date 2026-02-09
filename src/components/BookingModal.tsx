import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void; 
  editData?: any;
}

const BookingModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, editData }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
  userName: string;
  roomId: string | number;
  status: string;
}>({ 
  userName: '', 
  roomId: '', 
  status: 'Pending' 
});

  useEffect(() => {
    if (isOpen) {
      bookingService.getRooms().then(res => {
        const dataRaw = res.data;
        const dataFinal = dataRaw.$values || dataRaw; 
        setRooms(Array.isArray(dataFinal) ? dataFinal : []);
      }).catch(err => console.error("Gagal ambil data ruangan:", err));

      if (editData) {
        setFormData({ 
          userName: editData.userName, 
          roomId: editData.roomId, 
          status: editData.status 
        });
      } else {
        setFormData({ userName: '', roomId: '', status: 'Pending' });
      }
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData) {
        await bookingService.update(editData.id, formData);
      } else {
        await bookingService.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Gagal menyimpan data. Pastikan semua input benar.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#2d2d2d', padding: '30px', borderRadius: '12px', width: '400px', color: 'white'
      }}>
        <h2 style={{ marginBottom: '20px' }}>{editData ? "Edit Peminjaman" : "Peminjaman Baru"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nama Peminjam</label>
            <input 
              style={{ width: '100%', padding: '10px', backgroundColor: '#3c3c3c', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
              value={formData.userName} 
              required 
              onChange={e => setFormData({...formData, userName: e.target.value})} 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Pilih Ruangan</label>
            <select 
              style={{ width: '100%', padding: '10px', backgroundColor: '#3c3c3c', border: '1px solid #555', color: 'white', borderRadius: '4px' }}
              value={formData.roomId} 
              required
              onChange={e => setFormData({...formData, roomId: Number(e.target.value)})}
            >
              <option value="">-- Pilih --</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.capacity} Orang)
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" style={{ backgroundColor: '#198754', color: 'white', padding: '12px', width: '100%', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editData ? "Simpan Perubahan" : "Simpan Booking"}
          </button>
          
          <button type="button" onClick={onClose} style={{ marginTop: '10px', width: '100%', background: 'none', color: '#aaa', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
            Batal
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;