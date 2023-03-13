import postgres from "postgres";

export class LocationService {
  sql: postgres.Sql<{}>;

  constructor({ sql }: {
    sql: postgres.Sql<{}>
  }) {
    this.sql = sql;
  }

  async getAddressesMatchingLocation(latitude, longitude): Promise<string[]> {
    const url = new URL(process.env.GOOGLE_MAPS_API_URL || '');
    url.searchParams.append('latlng', `${latitude},${longitude}`);
    url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY || '');
    url.searchParams.append('result_type', 'premise');

    try {
      const response = await fetch(url);
      if (response.ok) {
        const parsed = await response.json();
        const candidateAddresses = buildAddressStrings(parsed.results)?.flat();
        if (candidateAddresses.length) {
          return candidateAddresses;
        } else {
          // todo: handle this with error message?
          throw new Error('no valid addresses found from GPS')
        }
      } else {
        throw new Error(`something went wrong in the response: ${JSON.stringify(response)}`)
      }
    } catch (err) {
      // todo: handling
      console.error(err)
      throw err;
    }
  }
}

function buildAddressStrings(data: any[]) {
  if (!data.length) throw new Error("data has no results");

  return data.map((result) => {
    return (
      result.address_components[0].short_name +
      " " +
      result.address_components[1].short_name
    ).toUpperCase();
  });
}