// Example Netlify Function (Node.js) that accepts JSON POST submissions.
// Save as .netlify/functions/submit.js
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    console.log('Received submission:', data);
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, received: data })
    };
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }
};
