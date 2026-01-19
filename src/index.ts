import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { login, logout } from "./controllers/auth.controller";
import { LoginSchema } from "./lib/validators";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
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
        credentials: true
    })
);
app.use("*", prettyJSON());

app.use("*", errorMiddleware);

// ============================================================
// HEALTH CHECK (Public)
// ============================================================
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

import employeeRoutes from "./routes/employee.routes";
import customerRoutes from "./routes/customer.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import jobRoutes from "./routes/job.routes";
import insuranceRoutes from "./routes/insurance.routes";

// ============================================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================================
import { zValidator } from "@hono/zod-validator";

// Auth Routes
app.post(
    "/api/v1/public/auth/login",
    zValidator("json", LoginSchema, (result, c) => {
        if (!result.success) {
            return c.json({ error: "Validation Failed", details: result.error }, 400);
        }
    }),
    login
);
app.post("/api/v1/public/auth/logout", logout);

// ============================================================
// PRIVATE ROUTES (Authentication Required)
// All routes under /api/v1/private/* require valid JWT token
// ============================================================
app.use("/api/v1/private/*", authMiddleware);

// Employee Management [PRIVATE]
app.route("/api/v1/private/employees", employeeRoutes);

// Customer Management [PRIVATE]
app.route("/api/v1/private/customers", customerRoutes);

// Vehicle Management [PRIVATE]
app.route("/api/v1/private/vehicles", vehicleRoutes);

// Job Management [PRIVATE]
app.route("/api/v1/private/jobs", jobRoutes);

// Insurance Management [PRIVATE]
app.route("/api/v1/private/insurances", insuranceRoutes);

// User Profile [PRIVATE]
app.get("/api/v1/private/profile", (c) => {
    const payload = c.get("jwtPayload");
    return c.json({
        message: "You are accessing a private route!",
        user: payload
    });
});

app.get("/ui", swaggerUI({ url: "/doc" }));
app.get("/doc", (c) => {
    return c.json(swaggerSpec);
});

// Thai Documentation Endpoint - serves separate HTML file with Mermaid flow diagrams
app.get("/docs/th", async (c) => {
    const htmlPath = new URL("./docs/thai-docs.html", import.meta.url).pathname;
    const htmlContent = await Bun.file(htmlPath).text();
    return c.html(htmlContent);
});

// Mini Test Frontend - Manual API Testing
app.get("/test", async (c) => {
    const htmlPath = new URL("./docs/mini-test.html", import.meta.url).pathname;
    const htmlContent = await Bun.file(htmlPath).text();
    return c.html(htmlContent);
});

// Demo App - React frontend build
app.get("/demo", serveStatic({ path: "./frontend/dist/index.html" }));
app.get(
    "/demo/*",
    serveStatic({
        root: "./frontend/dist",
        rewriteRequestPath: (path) => path.replace(/^\/demo/, "")
    })
);

app.get("/", (c) => {
    return c.text("Hello Hono + Bun + Turso!");
});

export default {
    port: 8080,
    fetch: app.fetch
};
