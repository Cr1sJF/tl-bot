import { format } from "winston";
import Log from "./Logger";
import { AxiosErrorLog, AxiosRequestLog } from "../../types/Axios";
const { combine, timestamp, printf, align } = format;

export default class AxiosLogger extends Log {
  constructor(service: string, flowId?: string) {
    super(service, flowId || "");

    this.logger.format = combine(
      timestamp({
        format: "DD/MM/YYYY HH:mm:ss.SSS",
      }),
      align(),
      printf((info) => {
        const meta = JSON.parse(info.message);

        if (meta.isError) {
          return `${info.timestamp} - (${
            info.service
          } - ${meta.method.toUpperCase()}_ERROR) Error ejecutando API ${meta.url} => status: ${
            meta.status
          } data: ${JSON.stringify(meta.data.data)}`;
        } else {
          return `${info.timestamp} - (${info.service} - ${meta.method.toUpperCase()}_${
            meta.type
          }) => ${JSON.stringify({
            URL: meta.url,
            data: meta.data,
            params: meta.params,
          })}`;
        }
      }),
    );
  }

  axiosLog(data: AxiosRequestLog) {
    this.logger.debug(JSON.stringify(data));
  }

  axiosErrorLog(data: AxiosErrorLog) {
    this.logger.error(JSON.stringify(data));
  }
}
