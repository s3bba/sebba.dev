/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import "./global.css";
import {Magnolia} from "@vichava/magnolia";
import {ViewComposeLazyFn} from "@vichava/magnolia/ui/view";
import {setup_key_listener} from "./component/navigation/navigation_manager.ts";
import {theme_state} from "./component/theme/theme_manager.ts";
import {start_api_preload} from "./network/blog_api.ts";
import blogs_view from "./view/blog/blogs_view.ts";
import contact_view from "./view/contact/contact_view.ts";
import fallback_view from "./view/fallback/fallback_view.ts";
import {compact_navigation_view, navigation_view} from "./view/navigation/navigation_view.ts";
import projects_view from "./view/projects/projects_view.ts";
import root_view from "./view/root/root_view.ts";

const root: HTMLElement | null = document.getElementById('root');

if (root === null) {
    throw new Error("Application root element not found");
}

console.debug("Loaded theme", theme_state.get().theme.name);
root.style.removeProperty("color");
root.style.removeProperty("background-color");

const magnolia: Magnolia = new Magnolia(root);

// Lazy load blo view as it's not needed on initial load
const blog_view: ViewComposeLazyFn = () => import("./view/blog/blog_view.ts");

magnolia.router().route("/", root_view);
magnolia.router().route("/contact", contact_view);
magnolia.router().route("/blog", blogs_view);
magnolia.router().route("/projects", projects_view);
magnolia.router().route_lazy("/blog/{slug}", blog_view);
magnolia.router().fallback_to(fallback_view);

magnolia.define_view_layout([navigation_view, compact_navigation_view, magnolia.router()]);

magnolia.init();

// Setup shortcuts right after the application is initialized
setup_key_listener();

// After the application is initialized user can see the page and interact with it
// Data and pages can be preloaded to improve user experience
// Preload API network
start_api_preload();

// Preload lazy routes
blog_view().then((): void => {
    console.debug("Preloaded blog view")
});
