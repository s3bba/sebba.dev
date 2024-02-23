/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {map, State, state} from "@vichava/magnolia/state";
import tinycolor, {ColorFormats} from "tinycolor2";
import {Theme, theme_map} from "../../model/theme_model.ts";

const revision: number = 0;
const storage_key: string = "theme";

interface ThemeStorage {
    revision: number,
    id: number
}

export interface SelectedTheme {
    id: number,
    theme: Theme
}

type SwatchLevel = {
    id: number,
    amount: number
};

const transparent_levels: number[] = [10, 25, 50, 75, 90];

const swatch_levels: SwatchLevel[] = [
    {id: 50, amount: 0.05},
    {id: 100, amount: 0.10},
    {id: 200, amount: 0.20},
    {id: 300, amount: 0.30},
    {id: 400, amount: 0.40},
    {id: 500, amount: 0.50},
    {id: 600, amount: 0.60},
    {id: 700, amount: 0.70},
    {id: 800, amount: 0.80},
    {id: 900, amount: 0.90},
    {id: 950, amount: 0.95}
];

/**
 * Retrieves the next theme based on the current theme.
 *
 * @return {SelectedTheme} - The next theme object with its corresponding ID and theme
 */
export function next_theme(): SelectedTheme {
    const current_theme_id: number = theme_state.get().id;

    for (let entry of theme_map) {
        const id: number = entry[0];
        if (id == current_theme_id) {
            const next_theme_id: number = id + 1;
            const next_theme: Theme | undefined = theme_map.get(next_theme_id);

            if (next_theme !== undefined) {
                return {
                    id: next_theme_id,
                    theme: next_theme
                };
            } else {
                return {
                    id: 0,
                    theme: theme_map.get(0)!
                };
            }
        }
    }

    return {
        id: 0,
        theme: theme_map.get(0)!
    };
}

/**
 * Returns the default theme.
 *
 * @returns {SelectedTheme} The default theme object
 */
function default_theme(): SelectedTheme {
    return {
        id: 0,
        // Theme map will (*should*) always have at least one theme
        theme: theme_map.get(0)!
    };
}

/**
 * Saves the theme with the given id.
 * Throws an error if the theme does not exist.
 *
 * @param {number} id - The id of the theme to be saved
 * @throws {Error} If the theme with the given id does not exist
 * @returns {void}
 */
export function save_theme(id: number): void {
    const theme: Theme | undefined = theme_map.get(id);

    if (!theme) {
        throw new Error(`Theme with id ${id} does not exist`);
    }

    apply_theme(theme)

    const theme_storage: ThemeStorage = {
        revision,
        id
    }

    localStorage.setItem("theme", JSON.stringify(theme_storage));
}

/**
 * Loads the selected theme from local storage.
 * If no theme is found in local storage, the default theme is returned.
 *
 * @return {SelectedTheme} The selected theme
 */
function load_theme(): SelectedTheme {
    const item: string | null = localStorage.getItem(storage_key);

    if (!item) {
        console.debug("No theme found in local storage")
        return default_theme();
    }

    const theme_storage: ThemeStorage = JSON.parse(item);

    // TODO (sebba): We should probably handle this better, at least let the user know that the theme is not available
    if (theme_storage.revision !== revision) {
        console.info("Theme revision mismatch, falling back to default theme")
        return default_theme();
    }

    const theme: Theme | undefined = theme_map.get(theme_storage.id);

    return !theme ? default_theme() : {
        id: theme_storage.id,
        theme
    };
}

/**
 * Applies color to given CSS variables and generates various color swatches.
 *
 * @param {string} name - The name of the CSS variable to apply color to
 * @param {string} inputColor - The input color in CSS format (hex, rgb, or hsl)
 * @param {boolean} invert - Whether to invert the generated swatch levels
 * @returns {void}
 */
function apply_color(
    name: string,
    inputColor: string,
    invert: boolean
): void {
    // Apply base color
    document.documentElement.style.setProperty(`--${name}`, inputColor);

    // Generate and apply transparent swatches
    for (const level of transparent_levels) {
        const new_color: ColorFormats.RGBA = tinycolor(inputColor).toRgb();

        new_color.a = level / 100;
        const rgba_string: string = `rgba(${new_color.r}, ${new_color.g}, ${new_color.b}, ${new_color.a})`;
        const property: string = `--${name}-transparent-${level}`;
        document.documentElement.style.setProperty(property, rgba_string);
    }

    // Generate and apply swatches
    for (const level of swatch_levels) {
        const new_color: ColorFormats.HSL = tinycolor(inputColor).toHsl();

        new_color.l = invert ? 1 - level.amount : level.amount;

        const hex_string: string = tinycolor(new_color).toHexString();
        const property: string = `--${name}-${level.id}`;

        document.documentElement.style.setProperty(property, hex_string);
    }
}

/**
 * Applies the specified theme to the application.
 *
 * @param {Theme} theme - The theme object containing the colors and inversion flag
 * @return {void}
 */
function apply_theme(theme: Theme): void {
    apply_color("text", theme.text_color, theme.inverted);
    apply_color("background", theme.background_color, theme.inverted);
    apply_color("primary", theme.primary_color, theme.inverted);
    apply_color("secondary", theme.secondary_color, theme.inverted);
    apply_color("accent", theme.accent_color, theme.inverted);
}

/**
 * Loads and applies the selected theme.
 * This function loads the theme and applies it to the current application.
 *
 * @returns {SelectedTheme} The selected theme object
 */
function load_and_apply_theme(): SelectedTheme {
    console.debug("Loading and applying theme")
    const selected_theme: SelectedTheme = load_theme();
    apply_theme(selected_theme.theme);
    return selected_theme;
}

export const theme_state: State<SelectedTheme> = state(load_and_apply_theme());
export const next_theme_state: State<SelectedTheme> = map(theme_state, () => next_theme())

// Listen for changes to the theme state and apply the new theme
theme_state.bind(value => {
    apply_theme(value.theme);
    save_theme(value.id);
});
