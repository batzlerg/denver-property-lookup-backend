FROM postgres:15.2
COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/
RUN chmod 0755 /docker-entrypoint-initdb.d/01-init.sh
ENV POSTGRES_DB=dpl_db
ENV POSTGRES_USER=dpl_user
ENV POSTGRES_PASSWORD=password
EXPOSE 5432