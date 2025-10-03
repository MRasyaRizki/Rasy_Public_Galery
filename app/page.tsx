// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../src/components/Navbar';
import UploadModal from '../src/components/UploadModal';
import GalleryCard from '../src/components/GalleryCard';
import DetailModal from '../src/components/DetailModal';

// -------------------------------------------------------------------
// START: METADATA
// Ini akan mengubah judul browser dan pratinjau link saat dibagikan
// -------------------------------------------------------------------
export const metadata = {
  // Judul utama yang muncul di browser tab dan di pratinjau link
  title: 'Rasy Public Gallery - Share Your Photos Here',
  // Deskripsi yang muncul di bawah judul saat link dibagikan
  description: 'Tempat berbagi dan mengunduh foto-foto keren menggunakan Next.js, Cloudinary, dan MongoDB.',
};
// -------------------------------------------------------------------
// END: METADATA
// -------------------------------------------------------------------

interface GalleryItem {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    uploaderName: string;
    createdAt: string;
}

const GalleryPage: React.FC = () => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        fetchGallery();
    }, []);
    
    const fetchGallery = async () => {
        try {
            const response = await axios.get<{ success: boolean, data: GalleryItem[] }>('/api/gallery');
            setGalleryItems(response.data.data);
        } catch (error) {
            console.error('Gagal mengambil galeri', error);
        }
    };
    
    const handleDelete = async (itemId: string) => {
        const token = prompt("Masukkan Kunci Rahasia Admin:");
        if (!token) return;

        if (!window.confirm("Yakin hapus?")) return;

        try {
            await axios.delete(`/api/gallery/${itemId}`, {
                headers: { 'X-Admin-Token': token },
            });
            alert('Gambar berhasil dihapus!');
            fetchGallery();
            setSelectedItem(null); // Tutup detail modal setelah hapus
        } catch (error) {
             const axiosError = error as { response?: { data?: { message?: string } } };
             const message = axiosError.response?.data?.message || 'Gagal menghapus. Cek konsol/Token.';
             alert(message);
             console.error('Delete Error:', error);
        }
    };

    const handleCardClick = (item: GalleryItem) => {
        setSelectedItem(item);
    };

    return (
        // TEMA: Hitam-Abu
        <div style={{ minHeight: '100vh', backgroundColor: '#18191C', color: '#F0F0F0' }}> 
            
            <Navbar onUploadClick={() => setIsUploadModalOpen(true)} />

            {/* CONTAINER UTAMA - Padding lebih kecil untuk Card yang lebih besar */}
            <main style={{ padding: '20px 2.5%', maxWidth: '1400px', margin: '0 auto' }}> 
                <h2 style={{ fontSize: '2rem', margin: '20px 0 30px', color: '#F0F0F0' }}>
                    Jelajahi Gambar Dari Orang Lain
                </h2>

                {/* RESPONSIVE GRID: 1 kolom di HP, 4 kolom di desktop */}
                <div style={{ 
                    display: 'grid', 
                    gap: '20px', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                }}>
                    {galleryItems.map((item) => (
                        <GalleryCard 
                            key={item._id} 
                            item={item} 
                            onCardClick={handleCardClick}
                        />
                    ))}
                </div>
            </main>

            {/* MODAL UPLOAD */}
            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchGallery}
            />

            {/* MODAL DETAIL */}
            <DetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default GalleryPage;