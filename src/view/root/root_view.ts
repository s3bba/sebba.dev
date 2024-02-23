/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {MgNode} from "@vichava/magnolia/ui/node";
import {mg, MgAnchor, MgDiv, MgSpan} from "@vichava/magnolia/ui/node_type";
import {View} from "@vichava/magnolia/ui/view";
import {next_theme_state, theme_state} from "../../component/theme/theme_manager.ts";
import {window_component} from "../../component/window/window_component.ts";
import {lang} from "../../content/static.ts";
import {Shortcut} from "../../model/shortcut_model.ts";
import {Theme, theme_map} from "../../model/theme_model.ts";
import styles from "./root_view.module.css";


/**
 * Creates a window component with the about content.
 *
 * @return {MgNode} - The created about window node
 */
function about_window(): MgNode {
    const content: MgDiv = window_component().style(styles.about_window);

    mg.p(lang.about.greeting).style(styles.about_greeting).child_of(content);
    mg.p(lang.about.name).style(styles.about_name).child_of(content);
    mg.p(lang.about.title).style(styles.about_title).child_of(content);

    mg.div().style(styles.split).child_of(content);

    lang.about.content.map(value => mg.p(value)).forEach(node => node.child_of(content));

    return content;
}

/**
 * Creates a navigation component with a link, label, and shortcut.
 *
 * @param {string} url - The URL of the navigation link
 * @param {string} label - The label text for the navigation link
 * @param {Shortcut} shortcut - The keyboard shortcut for the navigation link
 * @return {MgNode} - The created navigation component as a MgNode
 */
function navigation_component(
    url: string,
    label: string,
    shortcut: Shortcut
): MgNode {
    const window: MgDiv = window_component(true).style(styles.navigation_window);
    const link: MgAnchor = mg.router_a(url);

    link.child_of(window);
    mg.span(label).child_of(link);
    mg.code(`[${shortcut}]`).child_of(link);

    return window;
}

/**
 * Creates and returns a navigation window with navigation components.
 *
 * @return {MgNode} The navigation window as an MgNode object
 */
function navigation_window(): MgNode {
    const content: MgDiv = mg.div().style(["no_select", styles.navigation_container]);

    navigation_component("/blog", "Blog", Shortcut.Blog).child_of(content);
    navigation_component("/projects", "Projects", Shortcut.Projects).child_of(content);
    navigation_component("/contact", "Contact", Shortcut.Contact).child_of(content);

    return content;
}

/**
 * Returns the selected theme icon as an MgNode object.
 *
 * @returns {MgNode} The selected theme icon as an MgNode object
 */
function selected_theme_icon(): MgNode {
    return mg.code(" <<<>").style(styles.selected);
}

/**
 * Created the shortcut node for changing the theme.
 *
 * @return {MgNode} The `MgNode` with the shortcut information
 */
function next_theme_shortcut(): MgNode {
    return mg.code(`[${Shortcut.ChangeTheme}]`).style(styles.next_theme);

}

/**
 * Creates a theme component. This component is used to display a theme in the settings window.
 * Component looks like this: [● Aa] Theme Name
 *
 * @param {number} id - The ID of the theme component.
 * @param {Theme} theme - The theme object to be displayed.
 *
 * @return {MgNode} - The generated theme component container
 */
function theme_component(
    id: number,
    theme: Theme
): MgNode {
    let is_selected: boolean = false;
    let is_next: boolean = false;

    const container: MgDiv = mg.div().style(styles.theme);
    const preview: MgNode = mg.div().style(styles.theme_preview);
    preview.element().style.backgroundColor = theme.background_color;
    preview.child_of(container);

    const dot: MgSpan = mg.span("● ");
    dot.element().style.color = theme.primary_color;
    dot.child_of(preview);

    const text: MgSpan = mg.span("Aa");
    text.element().style.color = theme.text_color;
    text.child_of(preview);
    mg.p(theme.name).child_of(container);

    const selection: MgNode = mg.div().style(styles.selected_container);
    selection.child_of(container);

    // Determine if the theme is selected or the next theme to be selected
    if (id === theme_state.get().id) {
        is_selected = true;
        selected_theme_icon().child_of(selection);
    } else if (id === next_theme_state.get().id) {
        is_next = true;
        next_theme_shortcut().child_of(selection);
    }

    // We need to keep track of the theme state to update the selected theme
    const unbind_theme_state: () => void = theme_state.bind(value => {
        if (value.id === id) {
            if (is_selected) {
                return;
            }

            is_selected = true;
            selection.unmount_children();
            selected_theme_icon().child_of(selection);
            return;
        }

        is_selected = false;
    });

    // We need to keep track of the next theme state to update the next theme
    const unbind_next_theme: () => void = next_theme_state.bind(value => {
        if (value.id === id) {
            if (is_next) {
                return;
            }

            is_next = true;
            selection.unmount_children();
            next_theme_shortcut().child_of(selection);
            return;
        }

        is_next = false;
        selection.unmount_children();
    });

    // When the theme is clicked, we set the theme state to the current theme
    container.element().onclick = () => {
        theme_state.set({
            id, theme
        });
    }

    // We need to unbind the theme state listener when the component is unmounted to avoid memory leaks
    container.on_unmount(() => {
        unbind_theme_state();
        unbind_next_theme();
    })

    return container;
}

/**
 * Creates a settings window with a list of themes.
 *
 * @return {MgNode} The settings window node
 */
function settings_window(): MgNode {
    const content: MgDiv = window_component().style(["no_select", styles.settings_window]);

    for (let entry of theme_map) {
        const id: number = entry[0];
        const theme: Theme = entry[1];
        theme_component(id, theme).child_of(content);
    }

    return content;
}

/**
 * Creates and returns the root view of the application.
 *
 * @returns {View} The root view of the application
 */
export default function root_view(): View {
    const view: View = new View();
    const container: MgDiv = mg.div().style(styles.container);

    about_window().child_of(container);
    navigation_window().child_of(container);
    settings_window().child_of(container);

    return view.add_child(container);
}
