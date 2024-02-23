/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

export type BlogPostPreview = {
    id: number,
    slug: string,
    title: string,
    description: string,
    tags: string[],
    thumbnail_url: string,
    created_at: string,
};

export type BlogPostPreviewResponseBody = {
    posts: BlogPostPreview[]
}

export type BlogPost = {
    id: number,
    slug: string,
    title: string,
    tags: string[],
    thumbnail_url: string,
    created_at: string,
    updated_at: string,
    content: string
};
