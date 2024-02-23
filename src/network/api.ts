/**
 * Copyright (c) sebba.dev
 *
 * This source code is licensed under the GPLv3 license found in the
 * license.md file in the root directory of this source tree.
 */

import {fetch_resource, Resource} from "@vichava/std/resource";
import {Err, Ok, Result} from "ts-results";
import {ErrorType} from "../model/response_model.ts";

/**
 * The API_ENDPOINT variable represents the URL endpoint for the API server.
 * It is used to specify the base URL for API requests.
 *
 * If the VITE_API_ENDPOINT environment variable is defined, it will be used as the API endpoint.
 * Otherwise, the default value "http://127.0.0.1:3000" will be used.
 *
 * @type {string}
 * @default "http://127.0.0.1:3000"
 */
export const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT || "http://127.0.0.1:3000";

/**
 * Concatenates the given path with the API endpoint,
 * returning the complete URL.
 *
 * @param {string} path - The path to be appended to the API endpoint
 * @returns {string} The complete URL
 */
export function url(path: string): string {
    return `${API_ENDPOINT}${path}`;
}

/**
 * Executes a network request and returns a resource with the response body or an error.
 *
 * @template T - The type of the response body
 * @param {string} input - The URL or path to the resource
 * @param {RequestInit} [init] - Additional options to customize the request
 * @returns {Promise<Resource<T, ErrorType>>} - A resource with the response body or an error
 */
export async function exec_request<T>(
    input: string,
    init?: RequestInit
): Resource<T, ErrorType> {
    let result: Result<Response, unknown> = await fetch_resource(url(input), init);

    if (result.err) {
        return Err(ErrorType.NetworkError);
    }

    const response: Response = result.val;

    if (response.status === 404) {
        return Err(ErrorType.NotFound);
    }

    if (response.status !== 200) {
        return Err(ErrorType.FetchError);
    }

    const body: T = await response.json();
    return Ok(body);
}
