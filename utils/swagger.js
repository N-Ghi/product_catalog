const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Product Catalog API Project',
        version: '1.0.0',
        description: 'Documentation for my Express.js Product Catalog API Project',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                },
            },
            schemas: {
                Variant: {
                    type: 'object',
                    required: ['size', 'color', 'price', 'stock'],
                    properties: {
                    _id: { type: 'string', example: '64bd...' },
                    size: { type: 'string', example: '41' },
                    color: { type: 'string', example: 'Black' },
                    price: { type: 'number', example: 99.99 },
                    stock: { type: 'number', example: 25 }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['name', 'description', 'brand', 'category_id'],
                    properties: {
                    _id: { type: 'string', example: '64bd...' },
                    name: { type: 'string', example: 'Leather Sneakers' },
                    description: { type: 'string', example: 'Comfortable leather sneakers' },
                    brand: { type: 'string', example: 'Nike' },
                    category_id: { type: 'string', example: '64bd...' },
                    variants: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Variant' }
                    }
                }
                },
                Category: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        _id: { type: 'string', example: '64bd...' },
                        name: { type: 'string', example: 'Footwear' }
                    }
                },
                User: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        _id: { type: 'string', example: '64bd...' },
                        username: { type: 'string', example: 'john_doe' },
                        password: { type: 'string', format: 'password', example: 'securepassword123' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routers/*.js')],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
