import { Hono } from "hono";
import * as CustomerController from "../controllers/customer.controller";

const customerRoutes = new Hono();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     description: Retrieve a list of all customers
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The customer ID.
 *                   firstName:
 *                     type: string
 *                     description: The customer's first name.
 *                   lastName:
 *                     type: string
 *                     description: The customer's last name.
 *                   email:
 *                     type: string
 *                     description: The customer's email.
 *                   phoneNumber:
 *                     type: string
 *                     description: The customer's phone number.
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
customerRoutes.get("/", CustomerController.getCustomers);
customerRoutes.get("/:id", CustomerController.getCustomerById);
customerRoutes.post("/", CustomerController.createCustomer);
customerRoutes.patch("/:id", CustomerController.updateCustomer);
customerRoutes.delete("/:id", CustomerController.deleteCustomer);

export default customerRoutes;
