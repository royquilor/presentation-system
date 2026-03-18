const PREFIX = "study-comments:";

export type CommentsMap = Record<number, string[]>;

export function getComments(slug: string): CommentsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PREFIX + slug);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(slug: string, data: CommentsMap) {
  try {
    localStorage.setItem(PREFIX + slug, JSON.stringify(data));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded — comments could not be saved.");
    } else {
      throw e;
    }
  }
}

export function addComment(slug: string, slideIndex: number, text: string): CommentsMap {
  const data = getComments(slug);
  if (!data[slideIndex]) data[slideIndex] = [];
  data[slideIndex].push(text);
  save(slug, data);
  return data;
}

export function deleteComment(slug: string, slideIndex: number, commentIndex: number): CommentsMap {
  const data = getComments(slug);
  if (data[slideIndex]) {
    data[slideIndex].splice(commentIndex, 1);
    if (data[slideIndex].length === 0) delete data[slideIndex];
  }
  save(slug, data);
  return data;
}

export function updateComment(slug: string, slideIndex: number, commentIndex: number, text: string): CommentsMap {
  const data = getComments(slug);
  if (data[slideIndex] && data[slideIndex][commentIndex] !== undefined) {
    data[slideIndex][commentIndex] = text;
  }
  save(slug, data);
  return data;
}
