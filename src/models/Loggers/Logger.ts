import { Logger, createLogger, transports, format } from "winston";
const { combine, timestamp, printf, align } = format;

const build = (message: any, data?: any, meta?: Object) => {
  let result = {
    message,
    data: {
      data: data,
      meta: meta,
    },
  };

  if (typeof message == "string") {
    result.message = message;
  } else {
    result.message = "";
    result.data.data = message;
  }

  return result;
};

export default class Log {
  logger: Logger;
  constructor(service: string, flowId?: string) {
    this.logger = createLogger({
      levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 3,
      },
      format: combine(
        timestamp({
          format: "DD/MM/YYYY HH:mm:ss.SSS",
        }),
        align(),
        printf((info) => {
          const { data, meta } = info.data;
          let msgData = "";
          if (data) {
            if (typeof data == "object") {
              msgData += ": " + JSON.stringify(data);
            } else {
              msgData += ": " + data;
            }
          }
          // debugger;
          return `${info.timestamp} - (${info.service} - ${meta?.level || info.level}) => ${
            info.message
          } ${msgData}`;
        }),
      ),
      transports: [new transports.Console()],
      exitOnError: false,
      defaultMeta: {
        service,
        flowId: flowId,
      },
    });
  }

  setFlowId(flowId: string) {
    this.logger.defaultMeta.flowId = flowId;
  }

  getFlowId() {
    return this.logger.defaultMeta.flowId;
  }

  deleteFlowId() {
    this.logger.defaultMeta.flowId = null;
  }

  clear() {
    this.logger.defaultMeta = {};
  }

  info(message: string | Object, data?: Object) {
    this.logger.info(build(message, data));
  }

  log(message: string | Object, data?: Object) {
    this.logger.info(build(message, data, { level: "log" }));
  }

  warn(message: string | Object, data?: Object) {
    this.logger.warn(build(message, data));
  }

  error(message: string | Object, data?: Object) {
    let logEntry = build(message, data);
    logEntry.message = "🚨" + logEntry.message;
    if (logEntry.data.data) {
      let error = logEntry.data.data.message;
      let stack = logEntry.data.data.stack;
      logEntry.data.data = {
        error,
        stack,
      };
    }
    this.logger.error(logEntry);
  }

  debugg(message: string | Object, data?: Object) {
    this.logger.debug(build(message, data));
  }

  db(message: string | Object, data?: Object) {
    let log = build(message, data);
    log.message = `💾 ${log.message}`;
    this.logger.info(log);
  }

  // axiosError(message, data) {
  // 	this.logger.error(build(message, data), {
  // 		component: this.service,
  // 		reqId: httpContext.get("reqId"),
  // 		flowId: this.getFlowId(),
  // 	});
  // }
}
