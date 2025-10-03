// models/GalleryItem.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Definisikan interface untuk dokumen galeri
export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string; 
  uploaderName: string; 
  createdAt: Date;
  updatedAt: Date;
}

// Definisikan skema Mongoose
const GalleryItemSchema: Schema<IGalleryItem> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

// Ekspor Model
const GalleryItemModel: Model<IGalleryItem> = mongoose.models.GalleryItem
  ? (mongoose.models.GalleryItem as Model<IGalleryItem>)
  : mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItemModel;