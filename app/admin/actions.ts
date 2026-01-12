'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Article from '@/models/Article';
import dbConnect from '@/lib/mongodb';
import { deleteImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function deleteArticleAction(slug: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('Unauthorized');
    }

    await dbConnect();

    // 1. Find the article first to get image URL
    const article = await Article.findOne({ slug });
    if (!article) return;

    // 2. Delete Cover Image if exists
    if (article.coverImage) {
        await deleteImage(article.coverImage);
    }

    // 3. Delete content images? 
    // Ideally yes, but parsing content HTML to find valid Cloudinary URLs is complex.
    // For now, we stick to Cover Image deletion as requested.

    // 4. Delete Article
    await Article.findOneAndDelete({ slug });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/articles');
}
