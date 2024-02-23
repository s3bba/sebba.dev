/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {mg, MgDiv} from "@vichava/magnolia/ui/node_type";
import {View} from "@vichava/magnolia/ui/view";
import {padded_window_component} from "../../component/window/window_component.ts";
import {lang} from "../../content/static.ts";
import styles from "./projects_view.module.css";

type ProjectItemLink = {
    text: string,
    url: string
};

type ProjectItem = {
    title: string,
    description: string[],
    links: ProjectItemLink[]
};

const project_items: ProjectItem[] = lang.projects.items as ProjectItem[];

/**
 * Creates the view for the projects section.
 *
 * @returns {View} View for the projects section
 */
export default function projects_view(): View {
    const view: View = new View();
    const container: MgDiv = mg.div().style(styles.container);

    // Setup header
    let header = padded_window_component();
    header.child_of(container);

    mg.h1(lang.projects.title).style("margin_zero").child_of(header);
    lang.projects.content.map(value => mg.p(value)).forEach(node => node.child_of(header));

    // Setup items
    let items_container = mg.div().style(styles.items_container);
    items_container.child_of(container)

    for (let item of project_items) {
        const window = padded_window_component();
        window.child_of(items_container);

        mg.h2(item.title).style("margin_zero").child_of(window);
        item.description.map(value => mg.p(value)).forEach(node => node.child_of(window));


        let links_container = mg.div().style(styles.links_container);
        links_container.child_of(window);

        for (let link of item.links) {
            mg.a(link.url, link.text).child_of(links_container);
        }
    }

    return view.add_child(container);
}
