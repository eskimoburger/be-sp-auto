
import { file, write } from "bun";

async function convert() {
    try {
        const htmlPath = "./src/docs/demo-app.html";
        const tsPath = "./src/docs/demo-app.ts";

        console.log(`Reading ${htmlPath}...`);
        const htmlContent = await file(htmlPath).text();

        // Escape backticks for template string
        // We need to escape backticks ` -> \` 
        // AND we need to handle existing ${} if we don't want them interpolated, but since it's just a string export typescritp won't try to interpolate at runtime, but the backticks define the string boundary.
        // Actually, if we use `export const X = \`...\`;`, then `${}` inside WILL be interpolated by JS runtime if we aren't careful? 
        // No, wait. 
        // `export const HTML = \`... \${var} ...\`` -> This evaluates `var` immediately. We don't want that.
        // The HTML likely has `${}` for its own JS logic (client-side).
        // So we must escape `$` as well if it's followed by `{`. -> `\${`

        const escapedContent = htmlContent
            .replace(/\\/g, '\\\\') // Escape backslashes first to preserve them
            .replace(/`/g, '\\`')   // Escape backticks
            .replace(/\$/g, '\\$'); // Escape dollar signs to prevent interpolation

        const tsContent = `export const DEMO_APP_HTML = \`${escapedContent}\`;\n`;

        console.log(`Writing to ${tsPath}...`);
        await write(tsPath, tsContent);

        console.log("Conversion complete!");
    } catch (e) {
        console.error("Error converting file:", e);
    }
}

convert();
