CREATE SCHEMA api;

CREATE ROLE web_anon nologin;

GRANT USAGE ON SCHEMA api TO web_anon;