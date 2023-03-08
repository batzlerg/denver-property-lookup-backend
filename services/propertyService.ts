import postgres from "postgres";

export class PropertyService {
  sql: postgres.Sql<{}>;

  constructor({ sql }: {
    sql: postgres.Sql<{}>
  }) {
    this.sql = sql;
  }

  async getPropertyByAddress(address: string) {
    const matches: Array<Record<string, any>> = await this.sql`
      select *
      from api.property_residential
      where property_address like ${address} || '%'
      limit 5;
    `;
    return matches;
  }

  async suggestCompleteAddress(address: string): Promise<string[]> {
    const matches: Array<{ property_address: string }> = await this.sql`
        select
          property_address
        from api.property_residential
        where property_address like ${address} || '%'
        limit 5;
      `;
    return matches.map(address => address.property_address);
  }

  async filterByDbInclusion(addresses: string[]) {
    try {
      const result = await this.sql`
        select
          property_address
        from api.property_residential
        where property_address in ${this.sql(addresses)}
        limit 5;
      `;
      return result.map(address => address.property_address);
    }
    catch (err) {
      console.log('jones')
      console.error(err);
    }
  }

}