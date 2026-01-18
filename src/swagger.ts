import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SP Auto Service API",
            version: "1.0.0",
            description: "Enterprise-grade API documentation for SP Auto Service backend",
            contact: {
                name: "API Support",
                email: "support@example.com"
            }
        },
        servers: [
            {
                url: "/",
                description: "Relative path (Same host)"
            },
            {
                url: "http://localhost:8080",
                description: "Local development server"
            },
            {
                url: "http://127.0.0.1:8080",
                description: "Local development (IP)"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>"
                }
            },
            schemas: {
                // Shared Generic Schemas
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "Invalid request parameters"
                        }
                    }
                },
                // Model Schemas
                Employee: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "John Doe" },
                        role: { type: "string", example: "mechanic" },
                        phone: { type: "string", example: "0812345678" },
                        isActive: { type: "boolean", example: true },
                        username: { type: "string", example: "johndoe" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                Customer: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 101 },
                        name: { type: "string", example: "Alice Smith" },
                        phone: { type: "string", example: "0898765432" },
                        address: { type: "string", example: "123 Main St, Bangkok" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                Vehicle: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 501 },
                        customerId: { type: "integer", example: 101 },
                        registration: { type: "string", example: "กข 1234 กรุงเทพ" },
                        vinNumber: { type: "string", example: "1HGBH41JXMN109186" },
                        brand: { type: "string", example: "Toyota" },
                        model: { type: "string", example: "Camry" },
                        type: { type: "string", example: "Sedan" },
                        year: { type: "string", example: "2022" },
                        color: { type: "string", example: "White" },
                        // Registration Province Information
                        registrationProvince: { type: "string", example: "กรุงเทพมหานคร" },
                        registrationProvinceCode: { type: "string", example: "10" },
                        registrationDate: { type: "string", format: "date-time", example: "2022-03-15T00:00:00Z" },
                        // Owner Address Information
                        ownerProvince: { type: "string", example: "กรุงเทพมหานคร" },
                        ownerProvinceCode: { type: "string", example: "10" },
                        ownerDistrict: { type: "string", example: "คลองเตย" },
                        ownerSubDistrict: { type: "string", example: "พระโขนง" },
                        ownerAddress: { type: "string", example: "123 ถนนสุขุมวิท" },
                        ownerPostalCode: { type: "string", example: "10110" },
                        // Additional Vehicle Identifiers
                        engineNumber: { type: "string", example: "2TR-FE-1234567" },
                        chassisNumber: { type: "string", example: "JT12345678" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                VehicleBrand: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        code: { type: "string", example: "toyota" },
                        name: { type: "string", example: "โตโยต้า" },
                        nameEn: { type: "string", example: "Toyota" },
                        country: { type: "string", example: "ญี่ปุ่น" },
                        logoUrl: { type: "string", example: "https://vl.imgix.net/img/toyota-logo.png" },
                        models: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string", example: "Camry" },
                                    type: { type: "string", example: "รถเก๋ง (Sedan)" }
                                }
                            }
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                VehicleType: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        code: { type: "string", example: "sedan" },
                        name: { type: "string", example: "รถเก๋ง (Sedan)" },
                        nameEn: { type: "string", example: "Sedan" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                InsuranceCompany: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "วิริยะประกันภัย" },
                        contactPhone: { type: "string", example: "1557" },
                        logoUrl: { type: "string", example: "https://www.viriyah.co.th/logo.png" },
                        isActive: { type: "boolean", example: true },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                Job: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1001 },
                        jobNumber: { type: "string", example: "JOB-20240101-001" },
                        vehicleId: { type: "integer", example: 501 },
                        customerId: { type: "integer", example: 101 },
                        receiverId: { type: "integer", example: 1 },
                        insuranceCompanyId: { type: "integer", nullable: true, example: null },
                        paymentType: { type: "string", enum: ["Insurance", "Cash"], example: "Cash" },
                        excessFee: { type: "number", format: "float", example: 0.0 },
                        startDate: { type: "string", format: "date-time" },
                        estimatedEndDate: { type: "string", format: "date-time", nullable: true },
                        actualEndDate: { type: "string", format: "date-time", nullable: true },
                        repairDescription: { type: "string", example: "Change oil and filter" },
                        notes: { type: "string", nullable: true },
                        currentStageIndex: { type: "integer", example: 0 },
                        status: { type: "string", enum: ["CLAIM", "REPAIR", "BILLING", "DONE"], example: "CLAIM" },
                        isFinished: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                // Request Schemas
                LoginRequest: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                        username: { type: "string", example: "admin" },
                        password: { type: "string", example: "password123" }
                    }
                },
                CreateEmployeeRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "Jane Doe" },
                        role: { type: "string", example: "staff" },
                        phone: { type: "string", example: "0811112222" },
                        username: { type: "string", example: "janedoe" },
                        password: { type: "string", example: "secret" }
                    }
                },
                CreateCustomerRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "Bob Builder" },
                        phone: { type: "string", example: "0822223333" },
                        address: { type: "string", example: "456 Side St" }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);
