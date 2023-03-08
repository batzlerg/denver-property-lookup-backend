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
  //todo: verify postgres adapter syntax here
  async filterByDbInclusion(addresses: string[]) {
    console.log(addresses);
    try {

      const result = this.sql`    
        select
          property_address
        from api.property_residential
        where property_address in values ${this.sql(addresses.map(x => [x]))} || '%'
        limit 5;
        `.describe().then(console.log);
      return [];
    }
    catch (err) {
      console.log('jones')
      console.error(err);
    }
  }

}