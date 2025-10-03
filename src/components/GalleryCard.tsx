// components/GalleryCard.tsx
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

interface GalleryCardProps {
    item: GalleryItem;
    onCardClick: (item: GalleryItem) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, onCardClick }) => {
    return (
        <div 
            style={{ 
                // Card style Dark Mode
                border: '1px solid #3A3D42', 
                backgroundColor: '#2E2F32',
                color: '#F0F0F0',
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                cursor: 'pointer', 
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
            onClick={() => onCardClick(item)} // Card klik untuk Detail
        >
            {/* Area Gambar */}
            <div 
                style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '66.66%', // Rasio Aspek 3:2
                    overflow: 'hidden'
                }}
            >
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill={true} 
                    priority={true} 
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 600px) 100vw, 25vw" 
                />
            </div>
            
            {/* Footer Card yang minimalis */}
            <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{item.title}</strong>
                <p style={{ fontSize: '0.85rem', color: '#BBB', marginTop: 'auto' }}>
                    Oleh: {item.uploaderName}
                </p>
                {/* Tombol DELETE telah dipindahkan */}
            </div>
        </div>
    );
};

export default GalleryCard;