/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {Resource} from "@vichava/std/resource";
import {sync_lock, SyncLock} from "@vichava/std/sync/sync_lock";
import {Result} from "ts-results";
import {BlogPost, BlogPostPreviewResponseBody} from "../model/blog_model.ts";
import {ErrorType} from "../model/response_model.ts";
import {exec_request} from "./api.ts";

/**
 * Represents a synchronized lock for accessing a Result object containing
 * either a BlogPostPreviewResponseBody or an ErrorType.
 *
 * @type {SyncLock<Result<BlogPostPreviewResponseBody, ErrorType>>}
 */
const preview_lock: SyncLock<Result<BlogPostPreviewResponseBody, ErrorType>> = sync_lock();

/**
 * Fetches blog post previews.
 *
 * @returns {Resource<BlogPostPreviewResponseBody, ErrorType>} A resource instance that resolves to the blog post previews or an error.
 */
export async function fetch_blog_post_previews(): Resource<BlogPostPreviewResponseBody, ErrorType> {
    return preview_lock.get_or_init(() => exec_request("/blog/v1/posts"));
}

/**
 * Fetches a blog post by its slug.
 *
 * @param {string} slug - The slug of the blog post.
 * @returns {Resource<BlogPost, ErrorType>} - A promise that resolves to the fetched blog post or an error.
 */
export async function fetch_blog_post(slug: string): Resource<BlogPost, ErrorType> {
    return exec_request(`/blog/v1/posts/${slug}`);
}

/**
 * Starts the API preload process by fetching blog post previews.
 * @return {void}
 */
export function start_api_preload(): void {
    fetch_blog_post_previews().then((): void => {
        console.debug("Preloaded blog post previews")
    });
}
