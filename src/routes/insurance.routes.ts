import { Hono } from "hono";
import * as InsuranceController from "../controllers/insurance.controller";

const insuranceRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/insurances:
 *   get:
 *     summary: Get all insurance companies
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name or phone
 *     responses:
 *       200:
 *         description: List of insurance companies
 *       401:
 *         description: Unauthorized
 */
insuranceRoutes.get("/", InsuranceController.getInsurances);

/**
 * @swagger
 * /api/v1/private/insurances/{id}:
 *   get:
 *     summary: Get insurance company by ID
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insurance company details
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
insuranceRoutes.get("/:id", InsuranceController.getInsuranceById);

/**
 * @swagger
 * /api/v1/private/insurances:
 *   post:
 *     summary: Create a new insurance company
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
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
 *               contactPhone:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
insuranceRoutes.post("/", InsuranceController.createInsurance);

/**
 * @swagger
 * /api/v1/private/insurances/{id}:
 *   put:
 *     summary: Update an insurance company
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 */
insuranceRoutes.put("/:id", InsuranceController.updateInsurance);

/**
 * @swagger
 * /api/v1/private/insurances/{id}:
 *   delete:
 *     summary: Delete an insurance company
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 */
insuranceRoutes.delete("/:id", InsuranceController.deleteInsurance);

export default insuranceRoutes;
