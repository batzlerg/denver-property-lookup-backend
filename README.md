## Local development

### first time bootstrap
1. `sudo service docker start`
2. `docker-compose up -d`
3. `docker exec --workdir /opt/init pgdb sh init.sh`
4. `docker restart pgdb` (picks up schema changes)

### subsequent runs
1. `sudo service docker start`
2. `docker-compose up -d`

### full recreation
1. `docker rm -f $(docker ps -a -q) && docker volume rm $(docker volume ls -q)`
2. `docker exec --workdir /opt/init pgdb sh init.sh`

`localhost:8080` is SwaggerUI
`localhost:3000` is Bun backend

## Docker learnings

- `docker-compose up -d` to run in the background (detached mode)
- [full recreate of all containers](https://docs.tibco.com/pub/mash-local/4.3.0/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html)

## Helpful commands

- `docker exec -it pgdb psql dpl_db -U dpl_user` to get psql REPL, `\q` to quit