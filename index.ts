import postgres from 'postgres'
import { respond } from './utils/respond'

let sql: postgres.Sql<{}>;
try {
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
    console.log('request received:', request.url);
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/property":
        try {
          const address = url.searchParams.get('q');
          const matches = await sql`
            select *
            from api.property_residential
            where property_address like ${address} || '%'
            limit 5;
          `;
          if (matches?.length) {
            return respond(
              JSON.stringify(matches),
              { status: 200 }
            );
          } else {
            return respond(
              "No matching properties",
              { status: 404 }
            );
          }
        } catch (err) {
          console.error(err);
          return respond(
            null,
            { status: 500 }
          );
        }
      case "/propertyMatch":
        try {
          const address = url.searchParams.get('q');
          const matches: Array<{ property_address: string }> = await sql`
            select
              property_address
            from api.property_residential
            where property_address like ${address} || '%'
            limit 5;
          `;
          if (matches?.length) {
            return respond(
              JSON.stringify(matches.map(address => address.property_address)),
              { status: 200 }
            );
          } else {
            return respond(
              "No matching properties",
              { status: 404 }
            );
          }
        } catch (err) {
          console.error(err);
          return respond(
            null,
            { status: 500 }
          );
        }
      case "/search":
        const term = url.searchParams.get('q');
        const matches: Array<{ property_address: string }> = await sql`
          select fuzzy_search as property_address from api.fuzzy_search(${term});
        `;
        if (matches?.length) {
          const mapped = matches.map(address => address.property_address);
          const perfectMatch = mapped.find(address => address === term);
          const returnValue = perfectMatch ? [perfectMatch] : [...new Set(mapped)].slice(0, 5);
          return respond(
            JSON.stringify(returnValue),
            { status: 200 }
          );
        } else {
          return respond(
            "No matching properties",
            { status: 404 }
          );
        }
      default:
        return respond(
          null,
          { status: 400 }
        );
    }
  },
};