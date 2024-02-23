/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

export type Theme = {
    name: string,
    inverted: boolean,
    text_color: string,
    background_color: string,
    primary_color: string,
    secondary_color: string,
    accent_color: string
}

const dark_ocean: Theme = {
    name: "Ocean Dark",
    inverted: true,
    text_color: "#e5e5e5",
    background_color: "#050606",
    primary_color: "#3169b3",
    secondary_color: "#18899d",
    accent_color: "#090f13"
};

const light_ocean: Theme = {
    name: "Ocean Light",
    inverted: false,
    text_color: "#1a1a1a",
    background_color: "#f9fafa",
    primary_color: "#4b84ce",
    secondary_color: "#65d3e7",
    accent_color: "#eef3f7"
};

const sunset_dark: Theme = {
    name: "Oxide Dark",
    inverted: true,
    text_color: "#e5e5e5",
    background_color: "#050606",
    primary_color: "#b33f31",
    secondary_color: "#9d5e18",
    accent_color: "#130909"
};

const sunset_light: Theme = {
    name: "Oxide Light",
    inverted: false,
    text_color: "#1a1a1a",
    background_color: "#f1e7e1",
    primary_color: "#ce7d4b",
    secondary_color: "#e76565",
    accent_color: "#efded1"
};

const dark_forest: Theme = {
    name: "Forest Dark",
    inverted: true,
    text_color: "#d6e5d5",
    background_color: "#0b1408",
    primary_color: "#004d18",
    secondary_color: "#1b8848",
    accent_color: "#2f5131"
};

const light_forest: Theme = {
    name: "Forest Light",
    inverted: false,
    text_color: "#232423",
    background_color: "#e5f2e7",
    primary_color: "#558965",
    secondary_color: "#8cc199",
    accent_color: "#d8e8d6"
};

const dark_magnolia: Theme = {
    name: "Magnolia Dark",
    inverted: true,
    text_color: "#f1e9f2",
    background_color: "#1a1022",
    primary_color: "#955884",
    secondary_color: "#d67cb4",
    accent_color: "#2c142b"
};

const light_magnolia: Theme = {
    name: "Magnolia Light",
    inverted: false,
    text_color: "#1a1a1a",
    background_color: "#f9f5f8",
    primary_color: "#c9709e",
    secondary_color: "#faafe1",
    accent_color: "#e5d8e3"
};

export const theme_map: Map<number, Theme> = new Map<number, Theme>();
theme_map.set(0, dark_ocean);
theme_map.set(1, sunset_dark);
theme_map.set(2, dark_forest);
theme_map.set(3, dark_magnolia);
theme_map.set(4, light_ocean);
theme_map.set(5, sunset_light);
theme_map.set(6, light_forest);
theme_map.set(7, light_magnolia);