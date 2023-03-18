## Local development

### first time bootstrap
1. `sudo service docker start`
2. `docker compose up -d`
3. `docker exec --workdir /opt/init pgdb sh init.sh`
4. `docker restart pgdb` (picks up schema changes)

### subsequent runs
1. `sudo service docker start`
2. `docker compose up -d`

### full recreation one-liner (beware)
```
docker compose down && docker system prune -a
```

### generating dumpfile
1. uncomment opt/init bind mount lines in docker-compose
2. `docker compose up -d`
3. `docker exec --workdir /opt/init pgdb sh init.sh`
4. `docker exec -t pgdb pg_dumpall -U dpl_user > ./db/dump.sql`

`localhost:3000` is Bun backend

## Docker learnings

- `docker compose up -d` to run in the background (detached mode)
- [full recreate of all containers](https://docs.tibco.com/pub/mash-local/4.3.0/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html)
- ARG is used only during build, ENV is persisted in the container

## Helpful commands

- `docker exec -it pgdb psql dpl_db -U dpl_user` to get psql REPL, `\q` to quit