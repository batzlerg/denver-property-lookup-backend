
import { respond } from './utils/respond'
import { LocationService } from './services/locationService';
import { PropertyService } from './services/propertyService';
import { initDbConnection } from './utils/database';

const sql = await initDbConnection();

const propertyService = new PropertyService({ sql });
const locationService = new LocationService({ sql });

export default {
  port: 3000,
  async fetch(request: Request) {
    console.log('request received:', request.url);
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/property":
        try {
          const address = url.searchParams.get('q');
          const properties = await propertyService.getPropertyByAddress(address || '');
          if (properties?.length) {
            return respond(
              JSON.stringify(properties),
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
          const properties = await propertyService.suggestCompleteAddress(address || '');

          if (properties?.length) {
            return respond(
              JSON.stringify(properties),
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
      case "/location":
        const [lat, long] = [url.searchParams.get('lat'), url.searchParams.get('long')];
        const addresses = await locationService.getAddressesMatchingLocation(lat, long);
        const matchingAddresses = await propertyService.filterByDbInclusion(addresses);
        if (matchingAddresses?.length) {
          return respond(
            JSON.stringify(matchingAddresses),
            { status: 200 }
          );
        } else {
          return respond(
            "No matching properties",
            { status: 404 }
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