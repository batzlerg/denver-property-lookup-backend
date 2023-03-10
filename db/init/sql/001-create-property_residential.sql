CREATE TABLE api.property_residential (
  parid TEXT primary key,
  cd TEXT,
  ofcard TEXT,
  owner TEXT,
  co_owner TEXT null,
  owner_num TEXT,
  owner_dir TEXT null,
  owner_st TEXT,
  owner_type TEXT,
  owner_apt TEXT null,
  owner_city TEXT,
  owner_state TEXT,
  owner_zip TEXT,
  site_nbr TEXT,
  site_dir TEXT,
  site_name TEXT,
  site_mode TEXT,
  site_more TEXT null,
  tax_dist TEXT,
  -- PROP_CLASS TEXT,
  -- todo: why is this in the metadata but split into _LAND and _IMPS in the actual data?
  prop_class_land TEXT,
  prop_class_imps TEXT null,
  -- PROPERTY_CLASS TEXT,
  -- todo: also incorrect, is PROP_CLASS in the data
  prop_class TEXT,
  zone10 TEXT,
  d_class_cn TEXT,
  land_sqft BIGINT,
  area_abg BIGINT,
  bsmt_area BIGINT,
  fbsmt_sqft BIGINT,
  grd_area BIGINT,
  story FLOAT(4) null,
  style_cn TEXT null,
  bed_rms SMALLINT null,
  full_b SMALLINT null,
  hlf_b SMALLINT null,
  ccyrblt BIGINT null,
  ccage_rm BIGINT null, -- 0=null
  units SMALLINT null,
  asmt_appr_land BIGINT,
  total_value BIGINT,
  asdland BIGINT,
  assess_value BIGINT,
  asmt_taxable BIGINT,
  asmt_exempt_amt BIGINT,
  nbhd_1 DOUBLE PRECISION,
  nbhd_1_cn TEXT,
  legl_description TEXT
);

GRANT SELECT ON api.property_residential TO web_anon;