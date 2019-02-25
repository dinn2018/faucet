import { Database, verbose } from "sqlite3";
import * as path from 'path';
import * as os from "os";
import * as fs from "fs";

export default class DB {
    private database: Database;
    private path: string;
    async init() {
        try {
            if (!this.database) {
                this.path = path.join(os.homedir(), ".org.vechain.faucet")
                if (!fs.existsSync(this.path)) {
                    fs.mkdirSync(this.path);
                }
                let sqlite = verbose()
                this.database = await new sqlite.Database(path.join(this.path, "faucet.db"));
                await this.database.run(faucetTableSchema);
            }
            return this;
        } catch (err) {
            throw err;
        }
    }

    async exec(sql: string, ...params: any[]) {
        try {
            await this.database.serialize()
            let stmt = await this.database.prepare(sql, params)
            await stmt.run()
            await stmt.finalize()
        } catch (err) {
            throw err;
        }
    }

    async query(sql: string, params: any): Promise<any[]> {
        try {
            return new Promise((resolve, reject) => {
                this.database.all(sql, params, (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
            })
        } catch (err) {
            throw err;
        }
    }

    async close() {
        try {
            await this.database.close()
        } catch (err) {
            throw err;
        }
    }
}

declare module 'koa' {
    interface BaseContext {
        db: DB;
    }
}

const faucetTableSchema = `CREATE TABLE IF NOT EXISTS faucet (
    txid BLOB(32) NOT NULL primary key,
    address BLOB(20) NOT NULL, 
    vet BLOB NOT NULL, 
    thor BLOB NOT NULL, 
    remoteAddr BLOB NOT NULL, 
    createtime double NOT NULL,
    certhash BLOB NOT NULL
);`