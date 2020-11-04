FROM e2e-base
WORKDIR app
RUN apk update && \
    apk upgrade && \
    apk add git openssh openjdk8
#COPY ./keys/id_rsa_teamcity-e2e /root/.ssh/
#RUN chmod 400 /root/.ssh/id_rsa_teamcity-e2e
#RUN mkdir -p /root/.ssh
#RUN ssh-keyscan -p 7999 oxfordssh.awsdev.infor.com >> ~/.ssh/known_hosts
#RUN eval $(ssh-agent -s) && \
#    ssh-add ~/.ssh/id_rsa_teamcity-e2e && \
#    git clone -b develop ssh://git@oxfordssh.awsdev.infor.com:7999/itech/idm-e2e.git
RUN git clone -b master https://github.com/aytech/idm-e2e.git .
RUN mkdir -p /app/build/reports
RUN chown -R 1000:1000 /app
RUN chmod +x gradlew
CMD ["./gradlew", "--rerun-tasks", "chrome", "-Premote=http://selenium-hub:4444/wd/hub"]