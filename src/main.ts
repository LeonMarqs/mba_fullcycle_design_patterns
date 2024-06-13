import LoggerDecorator from "./application/decorator/LoggerDecorator";
import GenerateInvoices from "./application/usecase/GenerateInvoices";
import PgPromiseConnection from "./infra/database/PgPromiseConnection";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpServer from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import Mediator from "./infra/mediator/Mediator";
import JsonPresenter from "./infra/presenter/JsonPresenter";
import { ContractDatabaseRepository } from "./infra/repository/ContractDatabaseRepository";

const connection = new PgPromiseConnection();
const contractRepository = new ContractDatabaseRepository(connection);
const mediator = new Mediator();
mediator.on("InvoiceGenerated", (data: any) => {
  console.log(data);
});

const generateInvoices = new LoggerDecorator(
  new GenerateInvoices(contractRepository, new JsonPresenter(), mediator)
);

const httpServer: HttpServer = new ExpressAdapter();
new MainController(httpServer, generateInvoices);
httpServer.listen(3000);
