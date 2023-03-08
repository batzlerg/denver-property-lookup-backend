import postgres from 'postgres'

export async function initDbConnection(): Promise<postgres.Sql<{}>> {
  let sql: postgres.Sql<{}>;

  sql = postgres({
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  });

  try {
    const [{ version }] = await sql`SELECT version()`;

    if (!!version) {
      console.log('DB connection initiated.');
      return sql;
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error('unable to connect to the DB.');
    throw err;
  }
}