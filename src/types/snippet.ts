import { SnippetCreateRequest } from '../api/models/SnippetCreateRequest';

export interface LocalSnippet {
  id: string;
  editToken: string;
  expiresAt?: string;
  title?: string;
}

export type SnippetFormData = SnippetCreateRequest; 