/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import styles from "./fallback_view.module.css";

import {View} from "@vichava/magnolia/ui/view";
import {mg, MgDiv} from "@vichava/magnolia/ui/node_type";
import {padded_window_component} from "../../component/window/window_component.ts";

export default fallback_view;

// TODO (sebba): Make this look better
function fallback_view(): View {
    const view: View = new View();
    const container: MgDiv = mg.div().style(styles.container);
    const div: MgDiv = padded_window_component();
    div.child_of(container);

    mg.h1("[404] Page not found :/").child_of(div);

    return view.add_child(container);
}
