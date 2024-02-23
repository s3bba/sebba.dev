/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {magnolia} from "@vichava/magnolia";
import {Shortcut} from "../../model/shortcut_model.ts";
import {next_theme, theme_state} from "../theme/theme_manager.ts";

const actions: Map<string, () => void> = new Map();

actions.set(Shortcut.Root, () => {
    magnolia().router().navigate("/");
});

actions.set(Shortcut.Blog, (): void => {
    magnolia().router().navigate("/blog");
});

actions.set(Shortcut.Contact, (): void => {
    magnolia().router().navigate("/contact");
});

actions.set(Shortcut.Projects, (): void => {
    magnolia().router().navigate("/projects");
});

actions.set(Shortcut.ChangeTheme, (): void => {
    theme_state.set(next_theme());
});

/**
 * Sets up a key listener that listens for keyboard events and performs actions based on the pressed keys.
 *
 * @returns {void}
 */
export function setup_key_listener(): void {
    let is_navigating: boolean = false;

    let pressed_keys: Set<string> = new Set();

    document.addEventListener("keydown", (event: KeyboardEvent) => {
        pressed_keys.add(event.key);

        if (is_navigating) {
            return;
        }

        // Only navigate if a single key is pressed
        if (pressed_keys.size !== 1) {
            return;
        }

        is_navigating = true;
        // js is so fun
        actions.get(event.key)?.();
        is_navigating = false;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
        pressed_keys.delete(event.key);
    });
}
