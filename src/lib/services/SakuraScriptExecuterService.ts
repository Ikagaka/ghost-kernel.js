import { SakuraScriptExecuter } from "sakurascript-executer";
import { ShioriTransaction } from "shiori_transaction";
import { Shiorif } from "shiorif";

export class SakuraScriptExecuterService {
  readonly shiorif: Shiorif;
  readonly sakuraScriptExecuter: SakuraScriptExecuter;

  constructor(shiorif: Shiorif, sakuraScriptExecuter: SakuraScriptExecuter) {
    this.shiorif = shiorif;
    this.sakuraScriptExecuter = sakuraScriptExecuter;
  }

  async execute(transaction: ShioriTransaction) {
    let value = transaction.response.to("3.0").headers.Value;
    const requestHeaders = transaction.request.to("3.0").headers;
    // OnTranslate
    const translateTransaction = await this.shiorif.get3("OnTranslate", [
      value || "",
      "", // TODO: Reference1
      requestHeaders.ID as string,
      requestHeaders.references().join("\x01"),
    ]);
    const translateResponse = translateTransaction.response.to("3.0");
    if (translateResponse.status_line.code === 200) value = translateResponse.headers.Value;
    if (value != null) await this.sakuraScriptExecuter.execute(value.toString());
  }
}
