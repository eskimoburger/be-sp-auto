import { Hono } from "hono";
import * as JobController from "../controllers/job.controller";

const jobRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *             properties:
 *               vehicleId:
 *                 type: integer
 *               customerId:
 *                 type: integer
 *               insuranceCompanyId:
 *                 type: integer
 *               paymentType:
 *                 type: string
 *               repairDescription:
 *                 type: string
 *               excessFee:
 *                 type: number
 *               notes:
 *                  type: string
 *     responses:
 *       201:
 *         description: Job created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized - Valid JWT required
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
jobRoutes.post("/", JobController.createJob);

/**
 * @swagger
 * /api/v1/private/jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 jobNumber:
 *                   type: string
 *                 vehicleId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [CLAIM, REPAIR, BILLING, DONE]
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
jobRoutes.get("/:id", JobController.getJobDetails);

jobRoutes.get("/", JobController.getJobs);

/**
 * @swagger
 * /api/v1/private/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [CLAIM, REPAIR, BILLING, DONE]
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
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

export default jobRoutes;
