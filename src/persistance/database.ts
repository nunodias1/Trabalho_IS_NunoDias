import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Database } from "sqlite";

export async function connectDatabase(): Promise<Database> {
    const db = await open({
        filename: "bibliotecaLivros.db",
        driver: sqlite3.Database,
    })

    await db.run("PRAGMA foreign_keys = ON;");

    return db
}

export async function migrate(db: Database) {
    await db.migrate();
}

export default {
    connectDatabase: connectDatabase,
    migrate: migrate
}