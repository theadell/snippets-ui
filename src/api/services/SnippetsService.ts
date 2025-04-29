/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SnippetCreateRequest } from '../models/SnippetCreateRequest';
import type { SnippetCreateResponse } from '../models/SnippetCreateResponse';
import type { SnippetResponse } from '../models/SnippetResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SnippetsService {
    /**
     * create a new snippet
     * @param requestBody
     * @returns SnippetCreateResponse Snippet created successfully
     * @throws ApiError
     */
    public static createSnippet(
        requestBody: SnippetCreateRequest,
    ): CancelablePromise<SnippetCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/snippets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                413: `Content too large`,
            },
        });
    }
    /**
     * Get a snippet
     * Retrieve a snippet by its ID with optional password for protected snippets
     * @param id Snippet ID
     * @param xSnippetPassword Password for protected snippets
     * @returns SnippetResponse Snippet retrieved successfully
     * @throws ApiError
     */
    public static getSnippet(
        id: string,
        xSnippetPassword?: string,
    ): CancelablePromise<SnippetResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/snippets/{id}',
            path: {
                'id': id,
            },
            headers: {
                'X-Snippet-Password': xSnippetPassword,
            },
            errors: {
                401: `Password required or invalid password`,
                404: `Snippet not found or expired`,
            },
        });
    }
    /**
     * Update a snippet
     * Update an existing snippet using its ID and edit token
     * @param id Snippet ID
     * @param xEditToken Edit token for updating the snippet
     * @param requestBody
     * @param xSnippetPassword Password for protected snippets
     * @returns SnippetResponse Snippet updated successfully
     * @throws ApiError
     */
    public static updateSnippet(
        id: string,
        xEditToken: string,
        requestBody: SnippetCreateRequest,
        xSnippetPassword?: string,
    ): CancelablePromise<SnippetResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/snippets/{id}',
            path: {
                'id': id,
            },
            headers: {
                'X-Edit-Token': xEditToken,
                'X-Snippet-Password': xSnippetPassword,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid edit token or password`,
                404: `Snippet not found or expired`,
            },
        });
    }
    /**
     * Delete a snippet
     * Delete an existing snippet using its ID and edit token
     * @param id Snippet ID
     * @param xEditToken Edit token for deleting the snippet
     * @param xSnippetPassword Password for protected snippets
     * @returns void
     * @throws ApiError
     */
    public static deleteSnippet(
        id: string,
        xEditToken: string,
        xSnippetPassword?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/snippets/{id}',
            path: {
                'id': id,
            },
            headers: {
                'X-Edit-Token': xEditToken,
                'X-Snippet-Password': xSnippetPassword,
            },
            errors: {
                401: `Invalid edit token or password`,
                404: `Snippet not found or expired`,
            },
        });
    }
}
