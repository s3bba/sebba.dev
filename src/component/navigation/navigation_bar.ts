/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {magnolia} from "@vichava/magnolia";
import {State, state} from "@vichava/magnolia/state";
import {MgNode} from "@vichava/magnolia/ui/node";
import {mg} from "@vichava/magnolia/ui/node_type";
import {Shortcut} from "../../model/shortcut_model.ts";
import {window_component} from "../window/window_component.ts";
import styles from "./navigation_bar.module.css";

type NavigationEntry = {
    url: string,
    label: string
};

const navigation_entries: NavigationEntry[] = [
    {url: "/", label: `/ [${Shortcut.Root}]`},
    {url: "/blog", label: `/blog [${Shortcut.Blog}]`},
    {url: "/projects", label: `/projects [${Shortcut.Projects}]`},
    {url: "/contact", label: `/contact [${Shortcut.Contact}]`}
];

/**
 * Creates a navigation entry component.
 *
 * @param {NavigationEntry} entry - The navigation entry object
 * @return {MgNode} - The created navigation component
 */
function navigation_entry_component(entry: NavigationEntry): MgNode {
    const active: State<string[]> = state<string[]>([]);
    const link = mg.router_a(entry.url);
    mg.code(entry.label).child_of(link);
    link.bind_style(active);

    magnolia().router().on_router_load(path => {
        active.set(path === entry.url ? [styles.active] : []);
    });

    return link;
}

/**
 * Creates and returns a navigation bar component.
 *
 * @returns {MgNode} The created navigation bar component
 */
export function navigation_bar(): MgNode {
    const container: MgNode = mg.div().style(styles.navigation_container);
    const window: MgNode = window_component().style(["no_select", styles.navigation_window]);
    window.child_of(container);

    for (let index = 0; index < navigation_entries.length; index++) {
        // Add a separator between navigation entries if not the first or last entry
        if (index > 0 && index < navigation_entries.length) {
            mg.span(" | ").child_of(window);
        }

        const entry: NavigationEntry = navigation_entries[index];
        const link: MgNode = navigation_entry_component(entry);
        link.child_of(window);
    }

    return container;
}
