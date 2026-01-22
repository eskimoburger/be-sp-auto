import { Hono } from "hono";
import * as JobController from "../controllers/job.controller";

const jobRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/jobs:
 *   post:
 *     summary: Create a new job
 *     description: |
 *       Create a new job. Either provide vehicleId to reference an existing vehicle,
 *       or provide a vehicle object to auto-create/find by registration.
 *       Similarly, you can provide customerId or a customer object.
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
 *               - jobNumber
 *               - startDate
 *             properties:
 *               jobNumber:
 *                 type: string
 *                 description: Unique job number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               vehicleId:
 *                 type: integer
 *                 description: ID of existing vehicle (use this OR vehicle object)
 *               vehicle:
 *                 type: object
 *                 description: Inline vehicle data (finds by registration or creates new)
 *                 properties:
 *                   registration:
 *                     type: string
 *                     description: Vehicle registration (used for lookup)
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   color:
 *                     type: string
 *                   vinNumber:
 *                     type: string
 *                   chassisNumber:
 *                     type: string
 *               customerId:
 *                 type: integer
 *                 description: ID of existing customer (use this OR customer object)
 *               customer:
 *                 type: object
 *                 description: Inline customer data (finds by name+phone or creates new)
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
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
 *     summary: Get all jobs with filtering
 *     description: Retrieve a paginated list of jobs with support for multiple filter criteria including vehicle info, customer details, and date ranges
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [CLAIM, REPAIR, BILLING, DONE]
 *         description: Filter by job status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across vehicle registration, VIN, chassis number, customer name, and job number
 *       - in: query
 *         name: vehicleRegistration
 *         schema:
 *           type: string
 *         description: Filter by vehicle registration number (ทะเบียนรถ). Alias 'registration' also supported
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Filter by customer name (ชื่อ-นามสกุล). Alias 'customer' also supported
 *       - in: query
 *         name: chassisNumber
 *         schema:
 *           type: string
 *         description: Filter by chassis number (เลขตัวถัง). Alias 'chassis' also supported
 *       - in: query
 *         name: vinNumber
 *         schema:
 *           type: string
 *         description: Filter by VIN number. Alias 'vin' also supported
 *       - in: query
 *         name: jobNumber
 *         schema:
 *           type: string
 *         description: Filter by job number (เลขที่งาน)
 *       - in: query
 *         name: insuranceCompanyId
 *         schema:
 *           type: integer
 *         description: Filter by insurance company ID (บริษัทประกัน)
 *       - in: query
 *         name: startDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter jobs starting from this date (วันเริ่มต้น ตั้งแต่)
 *       - in: query
 *         name: startDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter jobs up to this date (วันเริ่มต้น ถึง)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [jobNumber, startDate, status, createdAt, updatedAt, estimatedEndDate, actualEndDate]
 *         description: Field to sort by (default is createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order - 'asc' for ascending, 'desc' for descending
 *     responses:
 *       200:
 *         description: List of jobs with pagination info
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
 *                   description: Total number of jobs matching the filters
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 statusCounts:
 *                   type: object
 *                   description: Counts of jobs per status
 *                   additionalProperties:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Valid JWT required
 */

/**
 * @swagger
 * /api/v1/private/jobs/steps/{stepId}:
 *   patch:
 *     summary: Update a job step's status
 *     description: Update a step's status. employeeId is required when status is 'completed' or 'in_progress'
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stepId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, skipped]
 *               employeeId:
 *                 type: integer
 *                 description: Required when status is 'completed' or 'in_progress'
 *     responses:
 *       200:
 *         description: Step updated successfully
 *       400:
 *         description: Invalid request or missing employeeId
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
jobRoutes.patch("/steps/:stepId", JobController.updateStepStatus);

export default jobRoutes;
