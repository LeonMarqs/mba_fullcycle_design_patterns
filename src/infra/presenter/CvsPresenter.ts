import moment from "moment";
import { Output } from "../../application/usecase/GenerateInvoices";
import Presenter from "../../application/presenter/Presenter";

export default class CvsPresenter implements Presenter {
  present(output: Output[]): any {
    const lines: any[] = [];
    for (const data of output) {
      const line: string[] = [];
      line.push(moment(data.date).format("YYYY-MM-DD"));
      line.push(`${data.amount}`);
      lines.push(line.join(";"));
    }

    return lines.join("\n");
  }
}
