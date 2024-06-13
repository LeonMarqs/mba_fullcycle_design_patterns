
import InvoiceGenerationFactory from "./InvoiceGenerationFactory";
import Payment from "./Payment";

export default class Contract {
  private payments: Payment[];

  constructor(
    readonly idContract: string,
    readonly description: string,
    readonly amount: number,
    readonly periods: number,
    readonly date: Date
  ) {
    this.payments = [];
  }

  addPayment(payment: Payment) {
    this.payments.push(payment);
  }

  getPayments() {
    return this.payments;
  }

  getBalance() {
    let balance = this.amount;

    this.getPayments().forEach((payment) => {
      balance -= payment.amount;
    });

    return balance;
  }

  generateInvoices(month: number, year: number, type: string) {
    const invoiceGenerationStrategy = InvoiceGenerationFactory.create(type);

    return invoiceGenerationStrategy.generate(this, month, year);
  }
}
