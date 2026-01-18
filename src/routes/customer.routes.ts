import { Hono } from "hono";
import * as CustomerController from "../controllers/customer.controller";

const customerRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     description: Retrieve a list of all customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
customerRoutes.get("/", CustomerController.getCustomers);
customerRoutes.get("/:id", CustomerController.getCustomerById);
customerRoutes.post("/", CustomerController.createCustomer);
customerRoutes.patch("/:id", CustomerController.updateCustomer);
customerRoutes.delete("/:id", CustomerController.deleteCustomer);

export default customerRoutes;
