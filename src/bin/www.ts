#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app";
import debug from "debug";
import http from "http";

/**
 * Get port from environment and store in Express.
 */

const debugApp = debug(process.env.DEBUG || "portfolio-back:*");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | string | false {
  const portNumber = parseInt(val, 10);

  if (isNaN(portNumber)) {
    // named pipe
    return val;
  }

  if (portNumber >= 0) {
    // port number
    return portNumber;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: Error) {
  if ((error as any).syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch ((error as any).code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();

  if (addr) {
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Hi. Portfolio-back is listening on " + bind);
  } else {
    debug("Server is listening, but address is not available.");
  }
}
