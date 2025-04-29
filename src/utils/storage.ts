import { LocalSnippet } from '../types/snippet';

const STORAGE_KEY = 'snippets';

export const getLocalSnippets = (): LocalSnippet[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addLocalSnippet = (snippet: LocalSnippet): void => {
  const snippets = getLocalSnippets();
  snippets.push(snippet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
};

export const removeLocalSnippet = (id: string): void => {
  const snippets = getLocalSnippets().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}; 