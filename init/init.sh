psql dpl_db -U dpl_user -f ./sql/000-pg-setup.sql &&
psql dpl_db -U dpl_user -f ./sql/001-create-real_property_residential.sql &&
psql dpl_db -U dpl_user -f ./sql/002-populate-real_property_residential.sql &&
echo "DB initialized!"