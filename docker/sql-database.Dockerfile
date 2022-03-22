FROM mysql:5.7 AS DATABASE

#COPY CREATE DATA TO CONTAINER
#ADD /sql/model-create.sql /docker-entrypoint-initdb.d
RUN apt-get update
RUN apt-get -y install locales

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8   

#SETTING UP DATABASE INFORMATION
ENV MYSQL_ROOT_PASSWORD=abc123
ENV MYSQL_DATABASE=taller
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=abc123
