import { Hono } from "hono";
import * as VehicleController from "../controllers/vehicle.controller";

const vehicleRoutes = new Hono();

/**
 * @swagger
 * /api/v1/private/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.get("/", VehicleController.getVehicles);

/**
 * @swagger
 * /api/v1/private/vehicles/brands:
 *   get:
 *     summary: Get all vehicle brands with logos
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicle brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleBrand'
 */
vehicleRoutes.get("/brands", VehicleController.getVehicleBrands);

/**
 * @swagger
 * /api/v1/private/vehicles/brands/{id}:
 *   get:
 *     summary: Get a vehicle brand by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle brand details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleBrand'
 *       404:
 *         description: Brand not found
 */
vehicleRoutes.get("/brands/:id", VehicleController.getVehicleBrandById);

/**
 * @swagger
 * /api/v1/private/vehicles/brands:
 *   post:
 *     summary: Create a new vehicle brand
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - nameEn
 *               - country
 *             properties:
 *               code:
 *                 type: string
 *                 example: toyota
 *               name:
 *                 type: string
 *                 example: โตโยต้า
 *               nameEn:
 *                 type: string
 *                 example: Toyota
 *               country:
 *                 type: string
 *                 example: ญี่ปุ่น
 *               logoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle brand created
 *       401:
 *         description: Unauthorized
 */
vehicleRoutes.post("/brands", VehicleController.createVehicleBrand);

/**
 * @swagger
 * /api/v1/private/vehicles/brands/{id}:
 *   patch:
 *     summary: Update a vehicle brand
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               country:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle brand updated
 *       401:
 *         description: Unauthorized
 */
vehicleRoutes.patch("/brands/:id", VehicleController.updateVehicleBrand);

/**
 * @swagger
 * /api/v1/private/vehicles/brands/{id}:
 *   delete:
 *     summary: Delete a vehicle brand
 *     tags: [Vehicles]
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
 *         description: Vehicle brand deleted
 *       401:
 *         description: Unauthorized
 */
vehicleRoutes.delete("/brands/:id", VehicleController.deleteVehicleBrand);

/**
 * @swagger
 * /api/v1/private/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registration
 *               - brand
 *               - customerId
 *             properties:
 *               registration:
 *                 type: string
 *                 example: "กข 1234 กรุงเทพ"
 *               brand:
 *                 type: string
 *                 example: "Toyota"
 *               model:
 *                 type: string
 *                 example: "Camry"
 *               year:
 *                 type: string
 *                 example: "2023"
 *               color:
 *                 type: string
 *                 example: "White"
 *               vinNumber:
 *                 type: string
 *                 example: "1HGBH41JXMN109186"
 *               customerId:
 *                 type: integer
 *               registrationProvince:
 *                 type: string
 *                 example: "กรุงเทพมหานคร"
 *               registrationProvinceCode:
 *                 type: string
 *                 example: "10"
 *               registrationDate:
 *                 type: string
 *                 format: date-time
 *               ownerProvince:
 *                 type: string
 *                 example: "กรุงเทพมหานคร"
 *               ownerProvinceCode:
 *                 type: string
 *                 example: "10"
 *               ownerDistrict:
 *                 type: string
 *                 example: "คลองเตย"
 *               ownerSubDistrict:
 *                 type: string
 *                 example: "พระโขนง"
 *               ownerAddress:
 *                 type: string
 *                 example: "123 ถนนสุขุมวิท"
 *               ownerPostalCode:
 *                 type: string
 *                 example: "10110"
 *               engineNumber:
 *                 type: string
 *                 example: "2TR-FE-1234567"
 *               chassisNumber:
 *                 type: string
 *                 example: "JT12345678"
 *     responses:
 *       201:
 *         description: Vehicle created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized - Valid JWT required
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
vehicleRoutes.post("/", VehicleController.createVehicle);

/**
 * @swagger
 * /api/v1/private/vehicles/{id}:
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
 *               model:
 *                 type: string
 *               year:
 *                 type: string
 *               color:
 *                 type: string
 *               vinNumber:
 *                 type: string
 *               registrationProvince:
 *                 type: string
 *               registrationProvinceCode:
 *                 type: string
 *               registrationDate:
 *                 type: string
 *                 format: date-time
 *               ownerProvince:
 *                 type: string
 *               ownerProvinceCode:
 *                 type: string
 *               ownerDistrict:
 *                 type: string
 *               ownerSubDistrict:
 *                 type: string
 *               ownerAddress:
 *                 type: string
 *               ownerPostalCode:
 *                 type: string
 *               engineNumber:
 *                 type: string
 *               chassisNumber:
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
 * /api/v1/private/vehicles/{id}:
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

// ============================================================
// VEHICLE TYPES ROUTES
// ============================================================

/**
 * @swagger
 * /api/v1/private/vehicles/types:
 *   get:
 *     summary: Get all vehicle types
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicle types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleType'
 */
vehicleRoutes.get("/types", VehicleController.getVehicleTypes);

/**
 * @swagger
 * /api/v1/private/vehicles/types/{id}:
 *   get:
 *     summary: Get a vehicle type by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleType'
 *       404:
 *         description: Type not found
 */
vehicleRoutes.get("/types/:id", VehicleController.getVehicleTypeById);

/**
 * @swagger
 * /api/v1/private/vehicles/types:
 *   post:
 *     summary: Create a new vehicle type
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - nameEn
 *             properties:
 *               code:
 *                 type: string
 *                 example: suv
 *               name:
 *                 type: string
 *                 example: SUV
 *               nameEn:
 *                 type: string
 *                 example: SUV
 *     responses:
 *       201:
 *         description: Vehicle type created
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.post("/types", VehicleController.createVehicleType);

/**
 * @swagger
 * /api/v1/private/vehicles/types/{id}:
 *   patch:
 *     summary: Update a vehicle type
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *               nameEn:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle type updated
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.patch("/types/:id", VehicleController.updateVehicleType);

/**
 * @swagger
 * /api/v1/private/vehicles/types/{id}:
 *   delete:
 *     summary: Delete a vehicle type
 *     tags: [Vehicles]
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
 *         description: Vehicle type deleted
 *       401:
 *         description: Unauthorized - Valid JWT required
 */
vehicleRoutes.delete("/types/:id", VehicleController.deleteVehicleType);

export default vehicleRoutes;
