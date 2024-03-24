import fastify from "fastify";
import config from "./app.config";
const qs = require("qs");
require('pino-pretty')

import sls from "./src/index";

const server = fastify({
  querystringParser: (str) => qs.parse(str),
  requestTimeout: 30 * 1000,
  logger: {
    level: process.env["MODE"] === "prod" ? 'info' : 'debug',
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        singleLine: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  },
});

const listen = () => {
  if (sls.handler) {
    server.route({
      url: "/",
      method: "GET",
      handler: async function (request, reply) {
        return sls.handler(request, reply, this);
      },
    });
  }

  server.listen(
    {
      host: "0.0.0.0",
      port: parseInt(process.env["PORT"] || config.port.toString()),
    },
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );

};
if (sls.init) {
  sls
    .init(server)
    .then(() => {
      listen();
    })
} else {
  listen();
}
