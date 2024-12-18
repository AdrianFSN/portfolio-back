import i18n from "i18n";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("Path to locales: ", path.join(__dirname, "..", "locales"));

i18n.configure({
  locales: ["en", "es", "fr"],
  directory: process.env.LOCALES_PATH || path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  autoReload: true,
  syncFiles: true,
  cookie: "X-portfolio-AS-locale",
});

i18n.setLocale("en");

export default i18n;
