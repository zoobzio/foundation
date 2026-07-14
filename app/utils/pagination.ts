const paginate = (page: number, pageCount: number): (number | "...")[] => {
  const pages: (number | "...")[] = [];
  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < pageCount - 2) pages.push("...");
    pages.push(pageCount);
  }
  return pages;
};

export const Pagination = { paginate };
