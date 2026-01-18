import { Hono } from "hono";
import { logger } from "hono/logger";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import { swaggerSpec } from "./swagger";

export const app = new Hono();

// Middlewares
app.use("*", logger());
app.use("*", compress());
app.use("*", secureHeaders());
app.use(
    "*",
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    })
);
app.use("*", prettyJSON());

// Health Check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

import employeeRoutes from "./routes/employee.routes";
import customerRoutes from "./routes/customer.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import jobRoutes from "./routes/job.routes";
import { login, logout } from "./controllers/auth.controller";
import { authMiddleware } from "./middleware/auth.middleware";

// Auth Routes
app.post("/auth/login", login);
app.post("/auth/logout", logout);

// Middleware for everything under /api
app.use("/api/*", authMiddleware);

// API Routes (Now Private)
app.route("/api/employees", employeeRoutes);
app.route("/api/customers", customerRoutes);
app.route("/api/vehicles", vehicleRoutes);
app.route("/api/jobs", jobRoutes);

app.get("/api/private/profile", (c) => {
    const payload = c.get('jwtPayload');
    return c.json({
        message: "You are accessing a private route!",
        user: payload
    });
});
// You can mount other private routes here
// app.route("/api/private/some-resource", someResourceRoutes);

app.get("/ui", swaggerUI({ url: "/doc" }));
app.get("/doc", (c) => {
    return c.json(swaggerSpec);
});

app.get("/", (c) => {
    return c.text("Hello Hono + Bun + Turso!");
});

export default {
    port: 8080,
    fetch: app.fetch,
};
