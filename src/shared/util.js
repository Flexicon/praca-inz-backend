const preparePaginationParams = (query, count, defaultLimit = null, defaultSort = null) => {
    const sort = query.sort || (defaultSort || 'id');
    const limit = Math.max(1, +query.limit || (defaultLimit || 100));
    const totalPages = Math.ceil(count / limit);
    let page = Math.max(1, +query.page || 1);
    page = Math.min(page, totalPages);

    return {
        sort,
        limit,
        totalPages,
        page,
    };
};

module.exports = {
    preparePaginationParams,
};