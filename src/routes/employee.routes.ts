import { Hono } from "hono";
import * as EmployeeController from "../controllers/employee.controller";

const employeeRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     description: Retrieve a list of all employees with pagination and search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itmes per page
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query (name or username)
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
employeeRoutes.get("/", EmployeeController.getEmployees);

/**
 * @swagger
 * /api/v1/private/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized - Valid JWT required
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
import { zValidator } from "@hono/zod-validator";
import { CreateEmployeeSchema } from "../lib/validators";

// ... existing swagger ...
employeeRoutes.post(
    "/",
    zValidator("json", CreateEmployeeSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: "Validation Failed", details: result.error }, 400);
        }
    }),
    EmployeeController.createEmployee
);

/**
 * @swagger
 * /api/v1/private/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       400:
 *         description: Invalid ID or delete failed
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
employeeRoutes.delete("/:id", EmployeeController.deleteEmployee);

export default employeeRoutes;
