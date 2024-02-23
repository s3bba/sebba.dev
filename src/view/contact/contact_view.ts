/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import styles from "./contact_view.module.css";

import {View} from "@vichava/magnolia/ui/view";
import {mg, MgDiv} from "@vichava/magnolia/ui/node_type";
import {State, state} from "@vichava/magnolia/state";
import {window_component} from "../../component/window/window_component.ts";
import {lang} from "../../content/static.ts";

/**
 * Creates the view for the contact page.
 *
 * @return {View} View for the contact page.
 */
export default function contact_view(): View {
    const view: View = new View();
    const container: MgDiv = window_component().style(styles.container);

    lang.contact.content.map(value => mg.p(value)).forEach(node => node.child_of(container));

    const copy_state: State<string> = state("copy")
    // TODO: Magnolia should support passing state to mg.button(text) function
    const copy_button = mg.div().style(styles.copy);

    copy_button.bind_text(copy_state);
    copy_button.element().onclick = () => {
        navigator.clipboard.writeText(lang.contact.email).then(() => {
            copy_state.set("copied");
            copy_button.style(styles.copied);
        })
    };

    const email_container: MgDiv = mg.div().style(styles.email_container);
    email_container.child_of(container);

    mg.p(`Email: ${lang.contact.email}`).child_of(email_container);
    copy_button.child_of(email_container);

    return view.add_child(container);
}
