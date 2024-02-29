/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {mg} from "@vichava/magnolia/ui/node_type";
import {View, ViewData} from "@vichava/magnolia/ui/view";
import {once_lock, OnceLock} from "@vichava/std/sync/once_lock";
import {Result} from "ts-results";
import {error_window_component, window_component} from "../../component/window/window_component.ts";
import {BlogPost} from "../../model/blog_model.ts";
import {ErrorType} from "../../model/response_model.ts";
import {fetch_blog_post} from "../../network/blog_api.ts";
import styles from "./blog_view.module.css";

type LastLoaded = {
    slug: string, post: Promise<Result<BlogPost, ErrorType>>
}

const blog_post_response_lock: OnceLock<LastLoaded> = once_lock();

let heading_next_id = 0;
/**
 * Generates a unique id for a heading based on the content.
 * **Do not mess with this function in async environments, or don't blame me when shit explodes on sunday at 4am**
 *
 * @param {string} content - The content of the heading
 * @returns {string} - The generated id for the heading
 */
const id_fn: (content: string) => string = (content: string): string => {
    // Create a unique id for the heading: system::init(5) -> system-init-5.sec-0
    const id = content.toLowerCase()
        // Remove all non-alphanumeric characters
        .replace(/[^a-z0-9]/g, '-')
        // Remove all duplicate dashes
        .replace(/-+/g, '-')
        // Remove all dashes at the beginning and end
        .replace(/(^-|-$)/g, '')
        // Add a number to the end to make it unique
        .concat(`.sec-${heading_next_id}`)

    heading_next_id += 1;
    return id;
}

const scroll_offset = 200;

/**
 * Scrolls to the element specified by the hash of the current URL on page load.
 * If the hash length is 0 or 1, or if the target element is not found, no scrolling will occur.
 *
 * @return {void}
 */
function scroll_on_load(): void {
    const hash = window.location.hash;

    if (hash.length === 0 || hash.length === 1) {
        return;
    }

    const id = window.location.hash.substring(1, window.location.hash.length);
    const target = document.getElementById(id);

    if (target === null) {
        return;
    }

    scroll_into_view(target);
}


/**
 * Scrolls the specified element into view.
 *
 * @param {Element} element - The element to scroll into view
 * @return {void}
 */
function scroll_into_view(element: Element): void {
    const position = element.getBoundingClientRect().top + window.scrollY - scroll_offset;

    window.scrollTo({
        top: position
    })
}

/**
 * Creates a blog post view based on the provided data.
 *
 * @param {ViewData} data - The data object containing information about the blog view
 * @return {View} - The rendered blog post view
 */
export default function blog_view(data: ViewData): View {
    const view = new View();
    const container = mg.div().style(styles.container);
    const slug = data.path_segments.get("slug");

    if (slug === undefined) {
        return view.add_child(mg.p("No blog post found :/"));
    }

    const loading = window_component();
    loading.child_of(container);
    mg.p("Loading blog post...").child_of(loading);

    if (blog_post_response_lock.value && blog_post_response_lock.value.slug !== slug) {
        blog_post_response_lock.take();
    }

    // TODO (sebba): This should be a component
    const blog_post_response = blog_post_response_lock.get_or_init(() => {
        const post: Promise<Result<BlogPost, ErrorType>> = fetch_blog_post(slug);

        return {
            slug, post
        }
    });

    blog_post_response.post.then(result => {
        loading.unmount();

        if (result.err) {
            const error = result.val;

            if (error === ErrorType.NotFound) {
                const error = window_component();
                error.child_of(container);
                mg.p("Blog post not found :/").child_of(error);
                return;
            }

            console.error(`Failed to fetch blog post with slug ${slug}`, result.err)
            const error_window = error_window_component("Failed to fetch blog post :/");
            error_window.child_of(container);
            return;
        }

        const sidebar = window_component().style(styles.sidebar);
        sidebar.child_of(container)

        const post = result.val;
        const post_window = window_component().style(styles.content);
        post_window.child_of(container);
        post_window.element().innerHTML = post.content;

        // All links should open in a new tab
        for (const element of post_window.element().querySelectorAll('a')) {
            element.target = "_blank";
        }

        // generate the sidebar content
        mg.div().add_child(mg.h2("Contents")).child_of(sidebar);


        for (const element of post_window.element().querySelectorAll('h2')) {
            const text = element.textContent;

            if (!text) {
                continue;
            }

            const id = id_fn(text);
            element.id = id;


            const entry = mg.div();
            entry.child_of(sidebar);
            mg.p(text).child_of(entry)

            entry.on_click(() => {
                scroll_into_view(element);
                window.history.replaceState(null, "", `#${id}`)
            });
        }

        for (const element of post_window.element().querySelectorAll('pre')) {
            const copy_container = mg.div().style(styles.copy_container);
            element.after(copy_container.element());
            // What the fuck, this is cursed
            copy_container.element().appendChild(element)

            const button = mg.div().style(styles.copy_button);
            button.child_of(copy_container);
            mg.code("copy").child_of(button);

            button.on_click(() => {
                let copy_content: string = element.textContent || "";

                navigator.clipboard.writeText(copy_content).then(() => {
                    button.unmount_children();
                    mg.code("copied").child_of(button);
                })
            });

            if (element.children.length <= 2) {
                continue;
            }

            const eval_element: Element | null = element.children.item(0);

            if (!eval_element) {
                continue;
            }

            const needs_eval = eval_element.textContent;

            if (!needs_eval || !needs_eval.startsWith("//$ eval")) {
                continue;
            }

            let code = "";
            for (let i = 1; i < element.children.length; i++) {
                code += element.children.item(i)?.textContent;
            }

            try {
                eval(code);
            } catch (e) {
                console.error(`Failed to execute script`, code, e)
            }

            element.style.display = "none";
        }

        scroll_on_load();
    });

    return view.add_child(container);
}
