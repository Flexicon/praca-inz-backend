const preparePaginationParams = (
  query,
  count,
  defaultLimit = null,
  defaultSort = null
) => {
  const sort = query.sort || (defaultSort || 'id');
  const limit = Math.max(1, +query.limit || (defaultLimit || 100));
  const totalPages = Math.ceil(count / limit);
  let page = Math.max(1, +query.page || 1);
  page = Math.min(page, totalPages);

  return {
    sort,
    limit,
    totalPages,
    page
  };
};

const incrementLastChar = str => {
  if (!str) {
    return undefined;
  }

  let c = String.fromCharCode(str.charCodeAt(str.length - 1) + 1);
  return str.substr(0, str.length - 1) + c;
};

module.exports = {
  preparePaginationParams,
  incrementLastChar
};
