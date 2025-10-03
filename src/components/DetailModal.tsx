// components/DetailModal.tsx

import React from 'react';
import Image from 'next/image';

interface GalleryItem {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    uploaderName: string;
    createdAt: string;
}

interface DetailModalProps {
    item: GalleryItem | null;
    onClose: () => void;
    onDelete: (itemId: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, onDelete }) => {
    if (!item) return null;

    const handleDeleteClick = () => {
        onDelete(item._id);
    };
    
    // FUNGSI BARU UNTUK DOWNLOAD LANGSUNG
    const handleDownload = async () => {
        if (!item || !item.imageUrl) return;

        try {
            // 1. Ambil data gambar sebagai Blob (Binary Large Object)
            const response = await fetch(item.imageUrl);
            const blob = await response.blob();

            // 2. Buat objek URL sementara dari Blob
            const url = window.URL.createObjectURL(blob);
            
            // 3. Buat tag <a> tersembunyi untuk memicu unduhan
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // Tentukan nama file yang disarankan
            a.download = `galeri-${item.title.replace(/\s/g, '_')}.jpg`;
            
            // 4. Tambahkan ke DOM, picu klik, dan bersihkan
            document.body.appendChild(a);
            a.click();
            
            // Hapus URL objek dan elemen <a> dari memori
            window.URL.revokeObjectURL(url);
            a.remove();
            
        } catch (error) {
            console.error("Gagal mengunduh gambar:", error);
            alert("Maaf, terjadi kesalahan saat mencoba mengunduh.");
        }
    };
    // ----------------------------------------------------

    return (
        // Overlay
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000 
        }} onClick={onClose}>
            {/* Modal Content */}
            <div 
                style={{ 
                    backgroundColor: '#2E2F32', // Background modal gelap
                    color: '#F0F0F0',
                    padding: '25px', 
                    borderRadius: '8px', 
                    maxWidth: '95%',
                    maxHeight: '90vh',
                    width: '900px', 
                    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '2rem', color: '#BBB', cursor: 'pointer' }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Gambar */}
                    <div style={{ 
                        position: 'relative', 
                        flex: '1 1 60%', 
                        minHeight: '400px', 
                        maxHeight: '70vh',
                    }}>
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill={true} 
                            style={{ objectFit: 'contain' }} 
                            sizes="(max-width: 900px) 100vw, 600px" 
                        />
                    </div>

                    {/* Detail & Tombol Download/Delete */}
                    <div style={{ flex: '1 1 35%', minWidth: '300px', padding: '10px 0' }}>
                        <h2 style={{ color: '#00CCFF', borderBottom: '1px solid #3A3D42', paddingBottom: '10px' }}>{item.title}</h2>
                        
                        <p style={{ fontSize: '1rem', marginTop: '15px', color: '#DDD' }}>
                            <strong>Uploader:</strong> {item.uploaderName}
                        </p>
                        <p style={{ fontSize: '1rem', color: '#DDD' }}>
                            <strong>Diunggah:</strong> {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        
                        <hr style={{ margin: '20px 0', borderTop: '1px solid #3A3D42' }} />

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Deskripsi:</h3>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', paddingRight: '10px', color: '#CCC' }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.description || "Tidak ada deskripsi."}</p>
                        </div>
                        
                        {/* CONTAINER UNTUK DUA TOMBOL AKSI */}
                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                            
                            {/* TOMBOL DOWNLOAD BARU (menggunakan <button> dan JS) */}
                            <button
                                onClick={handleDownload} // Panggil fungsi JS
                                style={{
                                    flexGrow: 1, 
                                    backgroundColor: '#00CCFF', 
                                    color: '#18191C', 
                                    border: 'none', 
                                    padding: '12px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00AADD')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00CCFF')}
                            >
                                ⬇️ Download
                            </button>

                            {/* TOMBOL DELETE ADMIN */}
                            <button 
                                onClick={handleDeleteClick} 
                                style={{ 
                                    flexGrow: 1, 
                                    backgroundColor: '#e74c3c', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '12px', 
                                    cursor: 'pointer', 
                                    borderRadius: '4px', 
                                    fontWeight: 'bold'
                                }}
                            >
                                Hapus (Admin)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;