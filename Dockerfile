FROM containers.cisco.com/aws_managed/tomcat-8-jws3.1_custom
MAINTAINER Lae2Cae-Operations
USER root
EXPOSE 8080
# Add Deployment WAR
RUN chmod -R 777 ${JWS_HOME} 
RUN chmod -R 777 ${HOME} 
COPY ./package/deployments/*.war ${JWS_HOME}/webapps/
RUN echo "Building Application Image!"
USER default
# Main Command
CMD ${JWS_HOME}/bin/serverStart.sh
