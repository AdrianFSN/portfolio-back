declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URI: string;
    // Agrega aquí otras variables de entorno que necesites
    NODE_ENV: "development" | "production" | "test"; // Ejemplo de otra variable
    DEBUG: string;
    PORT: string;
  }
}
