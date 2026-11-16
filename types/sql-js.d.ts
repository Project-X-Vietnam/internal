declare module "sql.js" {
  export type SqlValue = string | number | Uint8Array | null;

  export type QueryExecResult = {
    columns: string[];
    values: SqlValue[][];
  };

  export class Database {
    run(sql: string): void;
    exec(sql: string): QueryExecResult[];
    close(): void;
  }

  type SqlJsStatic = {
    Database: typeof Database;
  };

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<SqlJsStatic>;
}
