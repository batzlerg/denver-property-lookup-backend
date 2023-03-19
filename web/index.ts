
import { respond, getOptionsResponse } from './utils/respond'
import { LocationService } from './services/locationService';
import { PropertyService } from './services/propertyService';
import { initDbConnection } from './utils/database';

const sql = await initDbConnection();

const propertyService = new PropertyService({ sql });
const locationService = new LocationService({ sql });

export default {
  port: process.env.PORT ?? 3000,
  async fetch(request: Request) {
    try {
      console.log('request received:', request.url);
      const url = new URL(request.url);
      const optionsResponse = getOptionsResponse(request);
      switch (url.pathname) {
        case "/property": {
          if (optionsResponse) return optionsResponse;
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
        }
        case "/propertyMatch": {
          if (optionsResponse) return optionsResponse;
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
        }
        case "/location": {
          if (optionsResponse) return optionsResponse;
          const [lat, lng] = [url.searchParams.get('lat'), url.searchParams.get('lng')];
          if (!lat || !lng) {
            return respond(
              `Bad parameters - received ${JSON.stringify({ lat, lng })}`,
              { status: 400 }
            );
          }
          const addresses = await locationService.getAddressesMatchingLocation(lat, lng);
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
        }
        case "/search": {
          if (optionsResponse) return optionsResponse;
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
        }
        default:
          return respond(
            null,
            { status: 400 }
          );
      }
    } catch (err) {
      console.error(err);
      return respond(
        null,
        { status: 500 }
      );
    }
  },
};