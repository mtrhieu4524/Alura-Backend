// swagger.js

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const packageJson = require("./package.json");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alura API Docs",
      version: packageJson.version,
      description: "Tài liệu Swagger cho hệ thống",
      contact: {
        name: "Github",
        url: "https://github.com/mtrhieu4524/Alura-Backend.git",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.DEVELOPMENT_PORT || 4000}`,
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "API quản lý xác thực người dùng",
      },
      {
        name: "Product",
        description: "API quản lý sản phẩm",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "60f71a61a5a4c146a8a7b1cb",
            },
            name: {
              type: "string",
              example: "Sữa rửa mặt",
            },
            price: {
              type: "number",
              example: 120000,
            },
            description: {
              type: "string",
              example: "Sữa rửa mặt dịu nhẹ, phù hợp cho da nhạy cảm",
            },
            imgUrl: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            },
            categoryId: {
              type: "string",
              example: "60f71a61a5a4c146a8a7b1cc",
            },
            productTypeId: {
              type: "string",
              example: "60f71a61a5a4c146a8a7b1cd",
            },
            isPublic: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./swagger/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
