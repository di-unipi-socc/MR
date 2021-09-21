FROM maven:3.8.2-jdk-11-slim AS build
WORKDIR /usr/local/app
COPY . .
RUN rm -f src/main/java/com/rpaoletti/examples/RouteExample.java
RUN mvn clean package spring-boot:repackage

FROM openjdk:11-jre-slim
WORKDIR /usr/local/lib
COPY --from=build /usr/local/app/target/mismatchresolver-0.0.1-SNAPSHOT.jar mismatchresolver.jar
EXPOSE 8080
CMD ["java","-jar","/usr/local/lib/mismatchresolver.jar"]
