import Invoice from "../../domain/Invoice";
import Mediator from "../../infra/mediator/Mediator";
import JsonPresenter from "../../infra/presenter/JsonPresenter";
import Presenter from "../presenter/Presenter";
import ContractRepository from "../repository/ContractRepository";
import UseCase from "./UseCase";

export default class GenerateInvoices implements UseCase {
  constructor(
    readonly contractRepository: ContractRepository,
    readonly presenter: Presenter = new JsonPresenter(),
    readonly mediator: Mediator = new Mediator()
  ) {}

  async execute(input: Input): Promise<Output[]> {
    const output: Output[] = [];
    const contracts = await this.contractRepository.list();

    for (const contract of contracts) {
      const invoices: Invoice[] = contract.generateInvoices(
        input.month,
        input.year,
        input.type
      );

      invoices.forEach((invoice) => {
        output.push({
          date: invoice.date,
          amount: invoice.amount,
        });
      });
    }

    this.mediator.publish("InvoiceGenerated", output);
    return this.presenter.present(output);
  }
}

export type Input = {
  month: number;
  year: number;
  type: "cash" | "accrual";
  userAgent?: string;
};

export type Output = {
  date: Date;
  amount: number;
};
