/**
 * A render key for a picked file. Two files picked together never share a
 * name; across picks the size and the modification time tell a re-pick of
 * the same name apart.
 */
export const fileKey = (file: File): string =>
  `${file.name}:${file.size}:${file.lastModified}`;
