import { Hono } from "hono";
import * as EmployeeController from "../controllers/employee.controller";

const employeeRoutes = new Hono();

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     description: Retrieve a list of all employees
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
employeeRoutes.get("/", EmployeeController.getEmployees);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
employeeRoutes.post("/", EmployeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
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
