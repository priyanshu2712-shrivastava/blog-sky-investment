import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    author: string;
    category: string;
    isTrending: boolean;
    publishedAt: Date;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    views: number;
    reads: number;
}

const ArticleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        excerpt: { type: String, required: true },
        content: { type: String, required: true },
        coverImage: { type: String },
        author: { type: String, required: true },
        category: { type: String, required: true, default: 'Market Analysis & Trends' },
        isTrending: { type: Boolean, default: false },
        publishedAt: { type: Date, default: Date.now },
        isPublished: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        reads: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Prevent overwrite model compilation error
const Article: Model<IArticle> =
    mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
