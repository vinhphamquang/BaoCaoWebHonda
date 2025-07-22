'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      try {
        const response = await fetch('/api/swagger');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const spec = await response.json();
        setSwaggerSpec(spec);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSwaggerSpec();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container-honda py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Honda Plus API Documentation</h1>
            <p className="text-xl text-red-100">
              Complete API reference for Honda Plus platform
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-honda py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Loading API documentation...</span>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load API documentation</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {swaggerSpec && !loading && !error && (
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Honda Plus API Endpoints</h2>
                <p className="text-gray-600 mb-6">
                  Interactive API documentation for Honda Plus platform.
                  <Link href="/api/swagger" className="text-red-600 hover:text-red-700 ml-1">
                    View raw OpenAPI spec →
                  </Link>
                </p>
              </div>

              {/* API Endpoints */}
              <div className="space-y-6">
                {/* Health Check */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
                    <code className="text-lg font-mono">/api/health</code>
                  </div>
                  <p className="text-gray-600 mb-4">Check if the Honda Plus API is running and healthy</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example Response:</h4>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "success": true,
  "message": "Honda Plus API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "connected",
    "responseTime": 25
  }
}`}
                    </pre>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/api/health"
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Test Endpoint →
                    </Link>
                  </div>
                </div>

                {/* Cars API */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
                    <code className="text-lg font-mono">/api/cars</code>
                  </div>
                  <p className="text-gray-600 mb-4">Retrieve a list of Honda cars with optional filtering, sorting, and pagination</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Query Parameters:</h4>
                    <div className="space-y-2 text-sm">
                      <div><code className="bg-gray-100 px-2 py-1 rounded">search</code> - Search term for car name or model</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">model</code> - Filter by car model (Civic, Accord, CR-V, etc.)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">category</code> - Filter by category (sedan, suv, hatchback, coupe)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">sortBy</code> - Sort field (name, price, year, createdAt)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">sortOrder</code> - Sort order (asc, desc)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">limit</code> - Number of results to return</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Example URLs:</h4>
                    <div className="space-y-1 text-sm font-mono text-gray-700">
                      <div>/api/cars?limit=10&sortBy=price&sortOrder=asc</div>
                      <div>/api/cars?search=civic&category=sedan</div>
                      <div>/api/cars?model=Civic&minPrice=500000000</div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <Link
                      href="/api/cars?limit=5"
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Test Endpoint →
                    </Link>
                    <Link
                      href="/cars"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Cars Page →
                    </Link>
                  </div>
                </div>

                {/* Get Car by ID */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
                    <code className="text-lg font-mono">/api/cars/{'{id}'}</code>
                  </div>
                  <p className="text-gray-600 mb-4">Get a specific Honda car by its unique identifier</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Path Parameters:</h4>
                    <div className="text-sm">
                      <code className="bg-gray-100 px-2 py-1 rounded">id</code> - Car unique identifier (MongoDB ObjectId)
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href="/api/cars"
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors mr-3"
                    >
                      Get Car List First →
                    </Link>
                  </div>
                </div>

                {/* Orders API */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">GET</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">POST</span>
                    <code className="text-lg font-mono">/api/orders</code>
                  </div>
                  <p className="text-gray-600 mb-4">Manage car orders - retrieve all orders or create new orders</p>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">GET - Query Parameters:</h4>
                    <div className="space-y-2 text-sm">
                      <div><code className="bg-gray-100 px-2 py-1 rounded">status</code> - Filter by order status (pending, confirmed, processing, completed, cancelled)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">customerEmail</code> - Filter by customer email</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">sortBy</code> - Sort field (createdAt, totalAmount, customerName)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">sortOrder</code> - Sort order (asc, desc)</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">limit</code> - Number of results to return</div>
                      <div><code className="bg-gray-100 px-2 py-1 rounded">page</code> - Page number for pagination</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">POST - Create Order Body:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "nguyenvana@email.com",
  "customerPhone": "0901234567",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "carId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "paymentMethod": "bank_transfer",
  "notes": "Khách hàng muốn giao xe vào cuối tuần"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <Link
                      href="/api/orders"
                      target="_blank"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      View Orders →
                    </Link>
                  </div>
                </div>

                {/* Database Seeding */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">POST</span>
                    <code className="text-lg font-mono">/api/seed</code>
                  </div>
                  <p className="text-gray-600 mb-4">Populate the database with sample Honda car data for development and testing</p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Development Only</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>This endpoint should only be used in development environment to populate sample data.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Example Response:</h4>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "carsCreated": 12,
    "existingCars": 0
  }
}`}
                    </pre>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to seed the database? This will add sample data.')) {
                          fetch('/api/seed', { method: 'POST' })
                            .then(res => res.json())
                            .then(data => alert(JSON.stringify(data, null, 2)))
                            .catch(err => alert('Error: ' + err.message));
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Seed Database →
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Need More Details?</h3>
                <p className="text-blue-700 mb-4">
                  For complete API specification including schemas, examples, and error responses,
                  check out our OpenAPI specification.
                </p>
                <div className="flex space-x-3">
                  <Link
                    href="/api/swagger"
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    OpenAPI Spec (JSON) →
                  </Link>
                  <Link
                    href="https://swagger.io/tools/swagger-ui/"
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Import to Swagger UI →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
