CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA api;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch SCHEMA api;

CREATE OR REPLACE FUNCTION api.fuzzy_search(term text)
RETURNS TABLE(property_address text) AS $$
SELECT property_address FROM (
  SELECT priority, property_address FROM (
    (SELECT 1 AS priority, property_address
    FROM property_residential
    WHERE property_address LIKE term || '%'
    ORDER BY property_address
    LIMIT 5)
    UNION ALL
    (SELECT 2 as priority, property_address
    FROM property_residential
    WHERE SIMILARITY(property_address, term) > .3
    ORDER BY LEVENSHTEIN(property_address, term) ASC
    LIMIT 5)
  ) AS unified
  ORDER BY priority
) AS prioritized
$$ LANGUAGE SQL IMMUTABLE SET search_path = api;