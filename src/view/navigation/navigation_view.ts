/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {View} from "@vichava/magnolia/ui/view";
import {compact_navigation_bar, navigation_bar} from "../../component/navigation/navigation_bar.ts";

/**
 * Creates and returns a navigation view.
 *
 * @returns {View} The navigation view
 */
export function navigation_view(): View {
    const view: View = new View();
    const bar = navigation_bar();

    return view.add_child(bar);
}

export function compact_navigation_view(): View {
    const view: View = new View();
    const bar = compact_navigation_bar();

    return view.add_child(bar);
}
