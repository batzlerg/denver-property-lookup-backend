ALTER TABLE api.property_residential ADD COLUMN property_address TEXT GENERATED ALWAYS AS (site_nbr || case when site_dir <> '' then ' ' else '' end || site_dir || ' ' || site_name || ' ' || site_mode || case when site_more <> '' then ' ' || site_more else '' end) STORED;

-- index computed full address string for user input typeahead matching, e.g.
-- SELECT property_address FROM api.property_residential WHERE property_address LIKE '123 N DOWN%';
CREATE INDEX ON api.property_residential(property_address text_pattern_ops);