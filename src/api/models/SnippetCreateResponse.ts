/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SnippetCreateResponse = {
    /**
     * Unique identifier for the snippet
     */
    id: string;
    /**
     * secret token for editing snippet
     */
    editToken?: string;
    /**
     * ISO 8601 timestamp when the snippet will expire (if applicable)
     */
    expiresAt?: string;
};

