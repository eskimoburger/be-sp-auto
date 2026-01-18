import { Hono } from "hono";
import * as JobController from "../controllers/job.controller";

const jobRoutes = new Hono();

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
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
 *     responses:
 *       201:
 *         description: Job created
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
jobRoutes.post("/", JobController.createJob);

/**
 * @swagger
 * /api/jobs/{id}:
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
 *                   type: boolean
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
jobRoutes.get("/:id", JobController.getJobDetails);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   jobNumber:
 *                     type: string
 *                   vehicle:
 *                     type: object
 *                   customer:
 *                     type: object
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
jobRoutes.get("/", JobController.getJobs);

export default jobRoutes;
