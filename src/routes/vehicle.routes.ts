import { Hono } from "hono";
import * as VehicleController from "../controllers/vehicle.controller";

const vehicleRoutes = new Hono();

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   registration:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.get("/", VehicleController.getVehicles);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registration
 *               - brand
 *             properties:
 *               registration:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: string
 *               color:
 *                 type: string
 *               customerId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vehicle created
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.post("/", VehicleController.createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   patch:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registration:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.patch("/:id", VehicleController.updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.delete("/:id", VehicleController.deleteVehicle);


export default vehicleRoutes;
