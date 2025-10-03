// app/api/gallery/route.ts
import connectMongo from '../../../lib/mongodb';
import GalleryItem, { IGalleryItem } from '../../../models/GalleryItem';
import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    // Anda bisa tambahkan properti lain yang dipakai, tapi ini cukup
}

// API GET: Ambil semua item galeri (READ)
export async function GET() {
    await connectMongo();

    try {
        const items: IGalleryItem[] = await GalleryItem.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: items }, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ success: false, message: 'Gagal mengambil data galeri.' }, { status: 500 });
    }
}

// API POST: Unggah item baru (CREATE) menggunakan req.formData()
export async function POST(req: NextRequest) {
    await connectMongo();

    try {
        // 1. Ambil data dari request.formData()
        const formData = await req.formData();

        const file = formData.get('image') as File;
        const uploaderName = formData.get('uploaderName') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string | undefined;

        if (!file || !file.name) {
            return NextResponse.json({ success: false, message: 'File gambar wajib diunggah.' }, { status: 400 });
        }
        
        // 2. Konversi File Web API ke Data URI (Base64)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

        // 3. Unggah ke Cloudinary
        const uploadResult: CloudinaryUploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: "nextjs-gallery-upload", 
        }) as CloudinaryUploadResult;

        // 4. Simpan metadata ke MongoDB
        const newItem = new GalleryItem({
            title: title || 'Tanpa Judul',
            description: description,
            uploaderName: uploaderName || 'Anonim',
            imageUrl: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
        });
        await newItem.save();

        return NextResponse.json({ success: true, data: newItem }, { status: 201 });
    } catch (error) {
        console.error("POST Upload Error:", error);
        const errorMessage = (error instanceof Error) ? error.message : "Terjadi kesalahan yang tidak diketahui.";
        return NextResponse.json(
            { success: false, message: `Gagal mengunggah dan menyimpan item: ${errorMessage}` }, 
            { status: 500 }
        );
    }
}