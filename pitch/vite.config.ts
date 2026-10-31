import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// One self-contained index.html (fonts and code inlined) so dist/ opens by double-click from a USB stick.
// Photos, logos and the video stay as files next to it.
export default defineConfig({ plugins: [react(), viteSingleFile()], base: "./" });
