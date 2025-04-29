/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SnippetCreateRequest = {
    /**
     * optional title for the snippet
     */
    title?: string;
    /**
     * optional content type
     */
    contentType?: string;
    /**
     * The snippet content to store
     */
    content: string;
    /**
     * Optional password for snippet protection
     */
    password?: string;
    /**
     * Optional duration after which the snippet will expire
     */
    expiresIn?: string;
};

