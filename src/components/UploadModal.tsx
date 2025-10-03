// components/UploadModal.tsx
import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import axios from 'axios';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
    // Hooks harus dipanggil di atas
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploaderName, setUploaderName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); 
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        } else {
            setImageFile(null);
        }
    };

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!imageFile) return alert('Pilih file gambar terlebih dahulu.');
        
        setLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile); 
        formData.append('title', title);
        formData.append('description', description);
        formData.append('uploaderName', uploaderName);
        
        try {
            await axios.post('/api/gallery', formData);
            alert('Gambar berhasil diunggah!');
            
            onUploadSuccess();
            onClose(); 

            // Reset Form
            setTitle('');
            setDescription('');
            setUploaderName('');
            setImageFile(null);
        } catch (error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            const message = axiosError.response?.data?.message || 'Gagal mengunggah gambar. Cek konsol.';
            alert(message);
            console.error('Upload Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        // Overlay (Latar belakang gelap)
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
            zIndex: 2000
        }} onClick={onClose}>
            {/* Modal Content */}
            <div 
                style={{ 
                    backgroundColor: '#2E2F32', // Background modal gelap
                    padding: '30px', 
                    borderRadius: '8px', 
                    maxWidth: '90%', 
                    width: '500px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                    position: 'relative',
                    color: '#F0F0F0',
                }}
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 style={{ 
                    borderBottom: '2px solid #3A3D42', 
                    paddingBottom: '10px', 
                    marginBottom: '20px', 
                    color: '#00CCFF' 
                }}>
                    Unggah Gambar Baru
                </h2>
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#F0F0F0' }}
                >
                    &times;
                </button>

                <form onSubmit={handleUpload}>
                    {/* INPUT FIELDS - Dark Mode Style */}
                    <input type="text" placeholder="Nama Pengunggah" value={uploaderName} onChange={(e) => setUploaderName(e.target.value)} required style={{ 
                        width: '100%', padding: '10px', margin: '10px 0', 
                        backgroundColor: '#3A3D42', color: '#F0F0F0', border: '1px solid #555', borderRadius: '4px' 
                    }} />
                    <input type="text" placeholder="Judul Gambar" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ 
                        width: '100%', padding: '10px', margin: '10px 0', 
                        backgroundColor: '#3A3D42', color: '#F0F0F0', border: '1px solid #555', borderRadius: '4px' 
                    }} />
                    <textarea placeholder="Deskripsi (Opsional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ 
                        width: '100%', padding: '10px', margin: '10px 0', 
                        backgroundColor: '#3A3D42', color: '#F0F0F0', border: '1px solid #555', borderRadius: '4px', minHeight: '80px' 
                    }} />
                    
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        required 
                        ref={fileInputRef} // Hubungkan ref
                        style={{ display: 'none' }} // Sembunyikan input bawaan
                    />

                    {/* 2. TOMBOL CUSTOM YANG BISA DITEKAN */}
                    <button 
                        type="button" // Penting: type="button" agar tidak submit form
                        onClick={handleFileClick} 
                        style={{
                            width: '100%',
                            padding: '12px',
                            margin: '10px 0',
                            backgroundColor: imageFile ? '#308B5B' : '#555', // Hijau jika ada file, abu jika tidak
                            color: 'white',
                            border: '1px dashed #777',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = imageFile ? '#297A4F' : '#666')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = imageFile ? '#308B5B' : '#555')}
                    >
                        {imageFile 
                            ? `✅ File Dipilih: ${imageFile.name.substring(0, 30)}...`
                            : '📂 Pilih File Gambar'}
                    </button>
                    <button type="submit" disabled={loading || !imageFile} style={{ width: '100%', padding: '12px', backgroundColor: loading || !imageFile ? '#555' : '#00CCFF', color: loading || !imageFile ? '#aaa' : '#18191C', border: 'none', borderRadius: '4px', cursor: loading || !imageFile ? 'not-allowed' : 'pointer', marginTop: '15px', fontWeight: '700' }}>
                        {loading ? "Mengunggah..." : "Unggah ke Galeri"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;