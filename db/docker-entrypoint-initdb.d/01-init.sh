cd ./docker-entrypoint-initdb.d &&
psql dpl_db -U dpl_user -f ./sql/000-pg-setup.sql &&
psql dpl_db -U dpl_user -f ./sql/001-create-property_residential.sql &&
psql dpl_db -U dpl_user -f ./sql/002-populate-property_residential.sql &&
psql dpl_db -U dpl_user -f ./sql/003-derive-address.sql &&
psql dpl_db -U dpl_user -f ./sql/004-fuzzy-search.sql &&
echo "DB initialized!"