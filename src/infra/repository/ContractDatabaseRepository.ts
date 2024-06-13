
import ContractRepository from "../../application/repository/ContractRepository";
import DatabaseConnection from "../database/DatabaseConnection";
import Contract from "../../domain/Contract";
import Payment from "../../domain/Payment";

export class ContractDatabaseRepository implements ContractRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async list(): Promise<Contract[]> {
    const contracts = [];
    const contractsData = await this.connection.query(
      "select * from leonardo.contract",
      []
    );

    for (const contractData of contractsData) {
      const paymentsData = await this.connection.query(
        "select * from leonardo.payment where id_contract  = $1",
        [contractData.id_contract]
      );
      const contract = new Contract(
        contractData.id_payment,
        contractData.description,
        parseFloat(contractData.amount),
        contractData.periods,
        contractData.date
      );

      paymentsData?.forEach((paymentData: any) => {
        contract.addPayment(
          new Payment(
            paymentData.id_payment,
            paymentData.date,
            parseFloat(paymentData.amount)
          )
        );
      });

      contracts.push(contract);
    }
    return contracts;
  }
}
