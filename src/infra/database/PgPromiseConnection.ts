import pgPromise from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";

export default class PgPromiseConnection implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgPromise()(
      "postgres://postgres:postgres@localhost:5432/mba"
    );
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    return this.connection.$pool.end();
  }
}
