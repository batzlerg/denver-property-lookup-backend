import postgres from 'postgres'

let sql: postgres.Sql<{}>;
try {
  console.log({
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  })
  sql = postgres({
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  });
  const [{ version }] = await sql`SELECT version()`;
  console.log(version);
} catch (err) {
  console.error(err);
}

export default {
  port: 3000,
  async fetch(request: Request) {
    console.log('request received');
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/propertyMatch":
        try {
          const address = url.searchParams.get('q');
          const matches = await sql`
            select
              property_address
            from api.property_residential
            where property_address like ${address} || '%'
            limit 5;
          `;
          if (matches?.length) {
            return new Response(
              JSON.stringify(matches),
              { status: 500 }
            );
          } else {
            return new Response(
              "No matching properties",
              { status: 404 }
            );
          }
        } catch (err) {
          console.error(err);
          return new Response(
            null,
            { status: 500 }
          );
        }
      case "/rpc/fuzzy_search":
        const term = url.searchParams.get('q');
        const matches = await sql`
          select api.fuzzy_search(${term});
        `;
        if (matches?.length) {
          return new Response(
            JSON.stringify(matches),
            { status: 500 }
          );
        } else {
          return new Response(
            "No matching properties",
            { status: 404 }
          );
        }
      default:
        return new Response(
          null,
          { status: 400 }
        );
    }
  },
};