FROM e2e-base
WORKDIR app
RUN apk update && \
    apk upgrade && \
    apk add git openssh gradle
#COPY ./keys/id_rsa_teamcity-e2e /root/.ssh/
#RUN chmod 400 /root/.ssh/id_rsa_teamcity-e2e
#RUN mkdir -p /root/.ssh
#RUN ssh-keyscan -p 7999 oxfordssh.awsdev.infor.com >> ~/.ssh/known_hosts
#RUN eval $(ssh-agent -s) && \
#    ssh-add ~/.ssh/id_rsa_teamcity-e2e && \
#    git clone -b develop ssh://git@oxfordssh.awsdev.infor.com:7999/itech/idm-e2e.git
RUN git clone -b master https://github.com/aytech/idm-e2e.git .
#CMD ["tail", "-f", "/dev/null"]
CMD ["sh"]
#CMD ["gradle", "--rerun-tasks", "chrome", "-Premote=http://selenium-hub:4444/wd/hub"]

# gradle --rerun-tasks chrome -Premote=http://selenium-hub:4444/wd/hub

#FROM gradle:5.6.2-jdk8
#WORKDIR app
#COPY ./configuration /home/gradle/app
#COPY ./credentials /home/gradle/app
#COPY --from=repository /app/idm-e2e/src /home/gradle/app/src
#COPY --from=repository /app/idm-e2e/build.gradle /home/gradle/app
#COPY --from=repository /app/idm-e2e/src/test/resources/Upload/1.jpg /home/gradle/app
#COPY --from=repository /app/idm-e2e/src/test/resources/Upload/2.jpg /home/gradle/app
#ENTRYPOINT gradle --rerun-tasks chrome -Pidm.configuration.path=/home/gradle/app/configuration -Pidm.credentials.path=/home/gradle/app/credentials -Premote=http://selenium-hub:4444/wd/hub