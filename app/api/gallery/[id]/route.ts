// app/api/gallery/[id]/route.ts

import connectMongo from '../../../../lib/mongodb';
import GalleryItem from '../../../../models/GalleryItem';
import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Document } from 'mongoose'; // Tambahkan ini jika IGalleryItem butuh impor (biasanya tidak perlu di route file)

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Definisi type context yang paling umum dan kompatibel dengan Next.js App Router
type RouteContext = { params: { id: string } };

export async function DELETE(
    req: NextRequest, 
    context: RouteContext // Menggunakan type eksplisit untuk menghindari Type Error saat build
) {
    // --- LAPISAN KEAMANAN SECRET TOKEN ---
    const requestToken = req.headers.get('X-Admin-Token');

    if (!requestToken || requestToken !== ADMIN_TOKEN) {
        return NextResponse.json({ 
            success: false, 
            message: 'Otorisasi Gagal. Token Admin tidak valid.' 
        }, { status: 401 });
    }
    // --- KEAMANAN OK ---

    await connectMongo();
    
    // Ambil ID dari params
    const itemId = context.params.id; 
    
    try {
        const itemToDelete = await GalleryItem.findById(itemId);

        if (!itemToDelete) {
            return NextResponse.json({ success: false, message: 'Item galeri tidak ditemukan.' }, { status: 404 });
        }

        // HAPUS GAMBAR DARI CLOUDINARY
        try {
            await cloudinary.uploader.destroy(itemToDelete.imagePublicId);
        } catch (cloudError) {
            console.error("Gagal menghapus aset Cloudinary (lanjut menghapus data):", cloudError);
        }

        // HAPUS DATA DARI MONGODB
        const deletedItem = await GalleryItem.findByIdAndDelete(itemId);

        return NextResponse.json({ success: true, data: deletedItem }, { status: 200 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ success: false, message: 'Gagal memproses penghapusan.' }, { status: 500 });
    }
}