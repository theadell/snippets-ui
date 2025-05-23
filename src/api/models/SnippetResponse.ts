/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SnippetResponse = {
    /**
     * Unique identifier for the snippet
     */
    id: string;
    /**
     * Title of the snippet
     */
    title?: string;
    /**
     * The decrypted snippet content
     */
    content: string;
    /**
     * Type of the content of the snippet
     */
    contentType?: string;
    /**
     * ISO 8601 timestamp when the snippet was created
     */
    createdAt: string;
    /**
     * ISO 8601 timestamp when the snippet will expire (if applicable)
     */
    expiresAt?: string;
};

