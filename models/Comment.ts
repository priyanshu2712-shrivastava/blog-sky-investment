import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IComment extends Document {
    articleSlug: string;
    userEmail: string;
    userName: string;
    userImage?: string;
    content: string;
    parentId?: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
    {
        articleSlug: { type: String, required: true, index: true },
        userEmail: { type: String, required: true },
        userName: { type: String, required: true },
        userImage: { type: String },
        content: { type: String, required: true, maxlength: 2000 },
        parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    },
    { timestamps: true }
);

// Create compound index for efficient queries
CommentSchema.index({ articleSlug: 1, createdAt: -1 });
// Index for fetching replies efficiently
CommentSchema.index({ parentId: 1, createdAt: 1 });

// Prevent overwrite model compilation error
const Comment: Model<IComment> =
    mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
