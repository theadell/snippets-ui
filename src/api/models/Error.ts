/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Error = {
    /**
     * HTTP status code
     */
    status: number;
    /**
     * Error type or category
     */
    error: string;
    /**
     * Detailed error message
     */
    message: string;
    /**
     * Request path that generated the error
     */
    path?: string;
    /**
     * When the error occurred
     */
    timestamp?: string;
};

