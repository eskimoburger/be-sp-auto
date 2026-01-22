
import { swaggerSpec } from "../src/swagger-config";
import { write } from "bun";

console.log("Generating Swagger JSON...");
await write("src/swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("✅ Generated src/swagger.json");
