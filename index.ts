import postgres from 'postgres'

let sql: postgres.Sql<{}>;
try {
  console.table({
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
  sql = postgres({
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  });
  console.log('asdf')
} catch (err) {
  console.error(err);
}

export default {
  port: 3000,
  async fetch(request: Request) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/propertyMatch":
        try {
          const address = url.searchParams.get('property_address');
          const matches = await sql`
            select
              property_address
            from api.real_property_residential
            where property_address like '${address}%'
            limit 5
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
      // url.searchParams.append('term', `${input}`);
      default:
        return new Response(
          null,
          { status: 400 }
        );
    }
  },
};