export const paginate = (page: number, count: number): (number | "...")[] => {
  const pages: (number | "...")[] = [];
  if (count <= 7) {
    for (let i = 1; i <= count; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(count - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < count - 2) pages.push("...");
    pages.push(count);
  }
  return pages;
};
