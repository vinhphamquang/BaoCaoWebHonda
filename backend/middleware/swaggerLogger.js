/**
 * Middleware để log các API calls từ Swagger UI
 */
const swaggerLogger = (req, res, next) => {
  // Chỉ log các request từ Swagger UI
  const userAgent = req.get('User-Agent') || '';
  const referer = req.get('Referer') || '';
  
  if (userAgent.includes('swagger') || referer.includes('/api-docs')) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`📚 [SWAGGER] ${timestamp} - ${method} ${url} from ${ip}`);
    
    // Log request body cho POST/PUT requests
    if ((method === 'POST' || method === 'PUT') && req.body) {
      console.log(`📚 [SWAGGER] Request Body:`, JSON.stringify(req.body, null, 2));
    }
    
    // Log response
    const originalSend = res.send;
    res.send = function(data) {
      console.log(`📚 [SWAGGER] Response Status: ${res.statusCode}`);
      if (res.statusCode >= 400) {
        console.log(`📚 [SWAGGER] Error Response:`, data);
      }
      originalSend.call(this, data);
    };
  }
  
  next();
};

module.exports = swaggerLogger;
