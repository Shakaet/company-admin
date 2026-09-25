import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3001,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React core only
            if (id.includes("/react/") || id.includes("react-dom")) {
              return "react-core";
            }

            // Router
            if (id.includes("react-router")) {
              return "router";
            }

            // React Query
            if (id.includes("@tanstack")) {
              return "query";
            }

            // Tiptap
            if (id.includes("@tiptap")) {
              return "editor";
            }

            // Phone input
            if (id.includes("react-phone-number-input")) {
              return "phone-input";
            }

            // Map
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "map";
            }

            // Forms
            if (id.includes("react-hook-form")) {
              return "form";
            }

            // Everything else
            return "vendor";
          }
        },
      },
    },
  },
});
