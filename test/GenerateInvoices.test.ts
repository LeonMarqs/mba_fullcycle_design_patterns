import { ContractDatabaseRepository } from "../src/infra/repository/ContractDatabaseRepository";
import ContractRepository from "../src/application/repository/ContractRepository";
import CvsPresenter from "../src/infra/presenter/CvsPresenter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import GenerateInvoices, { Input } from "../src/application/usecase/GenerateInvoices";
import PgPromiseConnection from "../src/infra/database/PgPromiseConnection";

let generateInvoices: GenerateInvoices;
let connection: DatabaseConnection;
let contractRepository: ContractRepository;

// Teste de integração

beforeEach(() => {
  // const contractRepository: ContractRepository = {
  //   list: async function (): Promise<any> {
  //     return [
  //       {
  //         idContract: "",
  //         description: "",
  //         periods: 12,
  //         amount: "6000",
  //         date: new Date("2022-01-01T10:00:00"),
  //         payments: [
  //           {
  //             idPayment: "",
  //             idContract: "",
  //             amount: "6000",
  //             date: new Date("2022-01-05T10:00:00"),
  //           },
  //         ],
  //       },
  //     ];
  //   },
  // };

  connection = new PgPromiseConnection();
  contractRepository = new ContractDatabaseRepository(connection);

  generateInvoices = new GenerateInvoices(contractRepository);
});

test("Deve gerar as notas fiscais por regime de caixa", async () => {
  const input: Input = {
    month: 1,
    year: 2022,
    type: "cash",
  };
  const output = await generateInvoices.execute(input);
  expect(output.at(0)?.date).toEqual(new Date("2022-01-05T13:00:00.000Z"));
  expect(output.at(0)?.amount).toBe(6000);
});

test("Deve gerar as notas fiscais por regime de competência de janeiro", async () => {
  const input: Input = {
    month: 1,
    year: 2022,
    type: "accrual",
  };
  const output = await generateInvoices.execute(input);
  expect(output.at(0)?.date).toEqual(new Date("2022-01-01T13:00:00.000Z"));
  expect(output.at(0)?.amount).toBe(500);
});

test("Deve gerar as notas fiscais por regime de competência de fevereiro", async () => {
  const input: Input = {
    month: 2,
    year: 2022,
    type: "accrual",
  };
  const output = await generateInvoices.execute(input);
  expect(output.at(0)?.date).toEqual(new Date("2022-02-01T13:00:00.000Z"));
  expect(output.at(0)?.amount).toBe(500);
});

test("Deve gerar as notas fiscais por regime de competência por csv", async () => {
  const input: Input = {
    month: 1,
    year: 2022,
    type: "accrual",
  };
  const presenter = new CvsPresenter();
  const generateInvoices = new GenerateInvoices(contractRepository, presenter);

  const output = await generateInvoices.execute(input);
  expect(output).toBe("2022-01-01;500");
});

afterEach(async () => {
  await connection.close();
});
