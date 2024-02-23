/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import json from "./en_us.lang.json" assert {type: "json"};

/**
 * Represents the language file for the application. For ease of use, this file is exported as a JSON object. This gets
 * us the benefits of type checking and intellisense. There are no plans to support other languages at this time, if we
 * need to support them at some point, we can simply create a new file with the appropriate language code and change
 * this const to a function that returns the appropriate language file.
 */
export const lang = json;
