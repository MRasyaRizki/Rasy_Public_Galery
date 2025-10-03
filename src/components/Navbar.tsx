// components/Navbar.tsx
import React from 'react';

interface NavbarProps {
    onUploadClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onUploadClick }) => {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem 5%', 
            borderBottom: '1px solid #3A3D42', 
            backgroundColor: '#2E2F32', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            position: 'sticky', 
            top: 0,
            zIndex: 1000
        }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00CCFF' }}>
                Rasy Public Gallery
            </h1>
            
            <button 
                onClick={onUploadClick}
                style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#00CCFF', 
                    color: '#18191C', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontWeight: '700', 
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00AADD')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00CCFF')}
            >
                ➕ Upload Gambar
            </button>
        </nav>
    );
};

export default Navbar;