const { submitLeadCapture } = require('../../lib/lead-capture.js');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await submitLeadCapture(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({
      error: statusCode === 500 ? 'Failed to process booking request' : error.message,
    });
  }
}
