// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan bagian ini:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        // Cloudinary menggunakan path yang berisi Cloud Name Anda
        // Pathname ini wajib jika Anda membatasi gambar per folder
        // Jika Anda ingin mengizinkan SEMUA aset dari Cloudinary, 
        // Anda bisa menggunakan 'pathname: "/**"'
        pathname: '/**' 
      },
    ],
  },
};

module.exports = nextConfig;