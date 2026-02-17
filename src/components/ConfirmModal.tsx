import React from 'react';

interface ConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'approve' | 'reject';
}

const ConfirmModal: React.FC<ConfirmProps> = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  if (!isOpen) return null;

  const mainColor = type === 'approve' ? '#4caf50' : '#f44336';
  const icon = type === 'approve' ? '✅' : '❌';

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>{icon}</div>
          <h2 style={{ ...modalTitle, color: mainColor }}>{title}</h2>
        </div>
        
        <p style={messageStyle}>{message}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
          <button onClick={onConfirm} style={{ ...btnMain, backgroundColor: mainColor }}>
            Ya, Lanjutkan
          </button>
          <button onClick={onClose} style={btnCancel}>Batal</button>
        </div>
      </div>
    </div>
  );
};

const modalOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
};

const modalContent: React.CSSProperties = {
  backgroundColor: 'white', padding: '40px', borderRadius: '24px',
  width: '400px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
  fontFamily: "'Poppins', sans-serif"
};

const modalTitle = { fontSize: '22px', fontWeight: 700, margin: 0 };
const messageStyle = { color: '#666', fontSize: '14px', lineHeight: '1.6', margin: '10px 0' };
const btnMain = { color: 'white', padding: '14px', width: '100%', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '16px' };
const btnCancel = { background: 'none', color: '#888', padding: '10px', width: '100%', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 };

export default ConfirmModal;