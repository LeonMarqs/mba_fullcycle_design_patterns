
import Contract from "../src/domain/Contract";
import Payment from "../src/domain/Payment";

// Teste de unidade

test("Deve gerar faturas de um contrato", () => {
  const contract = new Contract(
    "",
    "",
    6000,
    12,
    new Date("2022-01-01T10:00:00")
  );
  const invoices = contract.generateInvoices(1, 2022, "accrual");
  expect(invoices.at(0)?.date).toEqual(new Date("2022-01-01T13:00:00.000Z"));
  expect(invoices.at(0)?.amount).toBe(500);
});

test("Deve calcular o saldo do contrato", () => {
  const contract = new Contract(
    "",
    "",
    6000,
    12,
    new Date("2022-01-01T10:00:00")
  );
  const payment = new Payment("", new Date("2022-01-10"), 2000);
  contract.addPayment(payment);
  expect(contract.getBalance()).toBe(4000);
});
