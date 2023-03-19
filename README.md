## Local development

### Running things locally
1. `sudo service docker start`
2. `docker compose up -d`

`localhost:3000` is Bun backend

## Docker learnings

- `docker compose up -d` to run in the background (detached mode)
- [full recreate of all containers](https://docs.tibco.com/pub/mash-local/4.3.0/doc/html/docker/GUID-BD850566-5B79-4915-987E-430FC38DAAE4.html)
- ARG is used only during build, ENV is persisted in the container

## Helpful commands

- `docker exec -it pgdb psql dpl_db -U dpl_user` to get psql REPL, `\q` to quit
- full recreation one-liner: `docker compose down && docker system prune -a`