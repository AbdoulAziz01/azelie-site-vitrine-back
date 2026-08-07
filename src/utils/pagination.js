function getPagination(query, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || defaultLimit, maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip, take: limit };
}

function buildMeta({ page, limit, total }) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}

module.exports = { getPagination, buildMeta };
