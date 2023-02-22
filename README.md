## Local development
1. `sudo service docker start`
2. `docker-compose up -d`
3. `docker cp ./sql/000-pg-setup.sql pgdb:0.sql && docker exec pgdb psql dpl_db dpl_user -f 0.sql`
3. `docker cp ./sql/001-create-real_property_residential.sql pgdb:1.sql && docker exec pgdb psql dpl_db dpl_user -f 1.sql`
3. `docker cp ./sql/002-populate-real_property_residential.sql pgdb:0.sql && docker exec pgdb psql dpl_db dpl_user -f 0.sql`


## Data population

might need sudo for some of these

```
docker cp ./data/2023-02-21/real_property_residential_characteristics.csv pgdb:input.csv

docker cp ./sql/000-pg-setup.sql pgdb:0.sql
docker cp ./sql/000-create-real_property_residential.sql pgdb:1.sql
docker cp ./sql/001-populate-real_property_residential.sql pgdb:2.sql
```

docker exec pgdb psql dpl_db dpl_user -f 1.sql
docker exec pgdb psql dpl_db dpl_user -f 2.sql



## Docker learnings

- `docker-compose up -d` to run in the background (detached mode)
- [full recreate of all containers](https://docs.tibco.com/pub/mash-local/4.3.0/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html)

## Helpful commands

- `docker exec -it pgdb psql dpl_db -U dpl_user` to get psql REPL, `\q` to quit