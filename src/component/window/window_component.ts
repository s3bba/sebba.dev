/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {mg, MgAnchor, MgDiv, MgRouterAnchor} from "@vichava/magnolia/ui/node_type";
import styles from "./window_component.module.css";

/**
 * Creates a window component with optional hover effect.
 *
 * @param {boolean} [hover_effect=false] - Flag to enable/disable hover effect on the window component
 * @return {MgDiv} - The created window component
 */
export function window_component(hover_effect: boolean = false): MgDiv {
    const div = mg.div();
    div.style(styles.window);

    if (hover_effect) {
        div.style(styles.window_effect);
    }

    return div;
}

/**
 * Creates a padded window component.
 *
 * @param {number} [padding=2] - The padding value in rem units. Default is 2
 * @returns {MgDiv} - The padded window component
 */
export function padded_window_component(padding: number = 2): MgDiv {
    const window: MgDiv = window_component();
    window.element().style.padding = `${padding}rem`;

    return window;
}

/**
 * Creates a router link window component.
 *
 * @param {string} url - The URL of the router link
 * @returns {MgRouterAnchor} The router link window component
 */
export function router_link_window_component(url: string): MgRouterAnchor {
    const a: MgAnchor = mg.router_a(url);
    a.style(styles.window);
    a.style(styles.window_effect);

    return a;
}

/**
 * Creates a loading window component.
 *
 * @returns {MgDiv} The loading window component
 */
export function loading_window_component(): MgDiv {
    const window: MgDiv = window_component();
    window.style(styles.loading_effect)

    return window;
}

/**
 * Creates an error window component with the given message.
 *
 * @param {string} message - The error message to display
 * @return {MgDiv} The created error window component
 */
export function error_window_component(message: string): MgDiv {
    const window: MgDiv = window_component();
    window.style(styles.error_effect);
    mg.p(message).child_of(window);

    return window;
}
