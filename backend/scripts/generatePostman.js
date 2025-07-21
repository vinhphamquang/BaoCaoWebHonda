const fs = require('fs');
const path = require('path');
const { specs } = require('../config/swagger');

/**
 * Script để generate Postman collection từ Swagger specification
 * Tự động tạo requests cho tất cả endpoints
 */

const generatePostmanCollection = () => {
  try {
    console.log('🔄 Generating Postman collection from Swagger spec...');

    const collection = {
      info: {
        _postman_id: 'vinfast-api-auto-generated',
        name: 'VinFast API (Auto-generated)',
        description: `Auto-generated Postman collection from Swagger specification\n\nGenerated on: ${new Date().toISOString()}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [],
      variable: [
        {
          key: 'baseUrl',
          value: 'http://localhost:8000/api',
          type: 'string'
        }
      ]
    };

    // Group endpoints by tags
    const groupedEndpoints = {};

    // Process each path in the Swagger spec
    Object.keys(specs.paths || {}).forEach(path => {
      const pathItem = specs.paths[path];
      
      Object.keys(pathItem).forEach(method => {
        const operation = pathItem[method];
        const tag = operation.tags?.[0] || 'Default';
        
        if (!groupedEndpoints[tag]) {
          groupedEndpoints[tag] = [];
        }

        // Create Postman request
        const request = {
          name: operation.summary || `${method.toUpperCase()} ${path}`,
          request: {
            method: method.toUpperCase(),
            header: [],
            url: {
              raw: `{{baseUrl}}${path}`,
              host: ['{{baseUrl}}'],
              path: path.split('/').filter(p => p)
            },
            description: operation.description || operation.summary
          }
        };

        // Add authentication if required
        if (operation.security && operation.security.length > 0) {
          request.request.auth = {
            type: 'bearer',
            bearer: [
              {
                key: 'token',
                value: '{{authToken}}',
                type: 'string'
              }
            ]
          };
        }

        // Add request body for POST/PUT requests
        if (['post', 'put', 'patch'].includes(method) && operation.requestBody) {
          request.request.header.push({
            key: 'Content-Type',
            value: 'application/json'
          });

          // Generate sample request body
          const schema = operation.requestBody.content?.['application/json']?.schema;
          if (schema) {
            const sampleBody = generateSampleFromSchema(schema, specs.components?.schemas);
            request.request.body = {
              mode: 'raw',
              raw: JSON.stringify(sampleBody, null, 2)
            };
          }
        }

        // Add query parameters
        if (operation.parameters) {
          const queryParams = operation.parameters
            .filter(param => param.in === 'query')
            .map(param => ({
              key: param.name,
              value: param.example || (param.schema?.example) || '',
              description: param.description,
              disabled: !param.required
            }));

          if (queryParams.length > 0) {
            request.request.url.query = queryParams;
          }
        }

        groupedEndpoints[tag].push(request);
      });
    });

    // Convert grouped endpoints to Postman folders
    Object.keys(groupedEndpoints).forEach(tag => {
      collection.item.push({
        name: tag,
        item: groupedEndpoints[tag],
        description: `API endpoints for ${tag}`
      });
    });

    // Save collection
    const outputPath = path.join(__dirname, '../docs/VinFast-API-Auto.postman_collection.json');
    fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

    console.log(`✅ Generated Postman collection: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - ${Object.keys(groupedEndpoints).length} folders`);
    console.log(`   - ${Object.values(groupedEndpoints).flat().length} requests`);

    return outputPath;

  } catch (error) {
    console.error('❌ Error generating Postman collection:', error.message);
    throw error;
  }
};

/**
 * Generate sample data from JSON schema
 */
function generateSampleFromSchema(schema, components = {}) {
  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/components/schemas/', '');
    return generateSampleFromSchema(components[refPath] || {}, components);
  }

  if (schema.type === 'object') {
    const sample = {};
    if (schema.properties) {
      Object.keys(schema.properties).forEach(key => {
        const prop = schema.properties[key];
        sample[key] = generateSampleFromSchema(prop, components);
      });
    }
    return sample;
  }

  if (schema.type === 'array') {
    return [generateSampleFromSchema(schema.items || {}, components)];
  }

  // Return example values based on type
  if (schema.example !== undefined) return schema.example;
  
  switch (schema.type) {
    case 'string':
      if (schema.format === 'email') return 'user@example.com';
      if (schema.format === 'date') return '2024-12-01';
      if (schema.format === 'date-time') return '2024-12-01T10:00:00Z';
      if (schema.enum) return schema.enum[0];
      return 'string';
    case 'number':
    case 'integer':
      return schema.minimum || 0;
    case 'boolean':
      return true;
    default:
      return null;
  }
}

// Run if called directly
if (require.main === module) {
  generatePostmanCollection();
}

module.exports = generatePostmanCollection;
