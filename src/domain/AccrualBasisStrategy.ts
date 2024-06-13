import moment from "moment";
import Contract from "./Contract";
import InvoiceGenerationStrategy from "./InvoiceGenerationStrategy";
import Invoice from "./Invoice";

export default class AccrualBasisStrategy implements InvoiceGenerationStrategy {
  generate(contract: Contract, month: number, year: number): Invoice[] {
    const invoices: Invoice[] = [];

    let period = 0;
    while (period <= contract.periods) {
      const date = moment(contract.date).add(period++, "months").toDate();
      if (date.getMonth() + 1 !== month || date.getFullYear() !== year)
        continue;

      const amount = contract.amount / contract.periods;
      invoices.push({ date: date, amount });
    }

    return invoices;
  }
}
