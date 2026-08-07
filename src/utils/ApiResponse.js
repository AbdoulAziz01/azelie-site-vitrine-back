class ApiResponse {
  constructor(res, statusCode, data = null, message = 'Succès', meta = undefined) {
    const payload = {
      success: statusCode < 400,
      message,
      data,
    };
    if (meta) payload.meta = meta;
    return res.status(statusCode).json(payload);
  }
}

function sendSuccess(res, { statusCode = 200, data = null, message = 'Succès', meta } = {}) {
  return new ApiResponse(res, statusCode, data, message, meta);
}

module.exports = { sendSuccess };
