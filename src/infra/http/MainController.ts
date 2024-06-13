import HttpServer from "./HttpServer";
import UseCase from "../../application/usecase/UseCase";

export default class MainController {
  constructor(readonly httpServer: HttpServer, readonly useCase: UseCase) {
    httpServer.on(
      "post",
      "/generate_invoices",
      async function (params: any, body: any, headers: any) {
        const input = body;
        input.userAgent = headers["user-agent"];
        input.host = headers.host;
        const output = await useCase.execute(input);
        return output;
      }
    );
  }
}
