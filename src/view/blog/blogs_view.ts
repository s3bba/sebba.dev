/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {MgNode} from "@vichava/magnolia/ui/node";
import {mg} from "@vichava/magnolia/ui/node_type";
import {View} from "@vichava/magnolia/ui/view";
import {DateTime} from "@vichava/std/time/date_time";
import {
    error_window_component,
    loading_window_component,
    router_link_window_component
} from "../../component/window/window_component.ts";
import {BlogPostPreview} from "../../model/blog_model.ts";
import {fetch_blog_post_previews} from "../../network/blog_api.ts";
import styles from "./blogs_view.module.css";

/**
 * Creates a blog post preview component.
 *
 * @param {BlogPostPreview} post - The blog post object
 * @return {MgNode} The post preview component
 */
function post_preview_component(post: BlogPostPreview): MgNode {
    const post_preview = router_link_window_component(`/blog/${post.slug}`).style(styles.post_preview);
    const content_container = mg.div().style(styles.content_container);
    content_container.child_of(post_preview);

    const content = mg.div().style(styles.content);
    content.child_of(content_container);

    mg.h1(post.title).style(styles.title).child_of(content);
    mg.p(post.description).child_of(content);

    const metadata = mg.div().style(styles.metadata);
    metadata.child_of(content);

    mg.code(post.tags.join(", ")).style(styles.tags).child_of(metadata);

    const created_at = new DateTime(post.created_at);
    mg.code(created_at.toLocaleDateString()).style(styles.date).child_of(metadata);

    post_preview.element().style.backgroundImage = `url(${post.thumbnail_url})`;
    post_preview.element().style.backgroundSize = "cover";

    return post_preview;
}

/**
 * This method is responsible for fetching and displaying blog post previews.
 *
 * @returns {View} The constructed view containing blog post previews
 */
export default function blogs_view(): View {
    const view = new View();
    const container = mg.div().style(styles.container);

    const loading = loading_window_component();
    loading.child_of(container)

    mg.p("Loading blog posts...").child_of(loading);

    fetch_blog_post_previews().then(result => {
        loading.unmount();

        if (result.err) {
            const error = error_window_component("Failed to fetch blog posts :/");
            error.child_of(container);
            return;
        }

        const posts: BlogPostPreview[] = result.val.posts;

        posts.forEach(post => {
            post_preview_component(post).child_of(container);
        });
    })

    return view.add_child(container);
}
