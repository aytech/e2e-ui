package com.idm.e2e.web.data;

import com.idm.e2e.web.models.E2EConfiguration;

import java.io.*;
import java.net.URL;

import static com.idm.e2e.web.configuration.AppConstants.*;

public class FilesResource {

    private E2EConfiguration configuration;
    private PrintWriter printWriter;
    private FileWriter fileWriter;

    public FilesResource(E2EConfiguration configuration) {
        this.configuration = configuration;
    }

    public void writeNewConfigurationFile(String sourceFileName, String targetFileName) throws IOException {
        setPrintWriter(sourceFileName, targetFileName);
        printWriter.println(String.format("%s=%s", E2EConfiguration.ENV, configuration.getEnvironment()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.URL, configuration.getUrl()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.FILE_PRIMARY, configuration.getFilePrimary()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.FILE_SECONDARY, configuration.getFileSecondary()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.DOCUMENT_TYPE, configuration.getDocumentType()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.DOCUMENT_TYPE_NEW, configuration.getDocumentTypeNew()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.DOWNLOAD_PATH, configuration.getDownloadPath()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.EMAIL, configuration.getEmail()));
        close();
    }

    public void writeNewCredentialsFile(String sourceFileName, String targetFileName) throws IOException {
        setPrintWriter(sourceFileName, targetFileName);
        printWriter.println(String.format("%s=%s", E2EConfiguration.USER, configuration.getUser()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.PASSWORD, configuration.getPassword()));
        close();
    }

    public void writeDockerFile(String sourceFileName, String targetFileName) throws IOException {
        setPrintWriter(sourceFileName, targetFileName);
        printWriter.println("FROM alpine as repository");
        printWriter.println(String.format("LABEL maintainer=\"%s\"", MAINTAINER));
        printWriter.println("WORKDIR app");
        printWriter.println("RUN apk update && \\");
        printWriter.println("\tapk upgrade && \\");
        printWriter.println("\tapk add git openssh");
        printWriter.println("COPY ./keys/id_rsa_teamcity-e2e /root/.ssh/");
        printWriter.println("RUN chmod 400 /root/.ssh/id_rsa_teamcity-e2e");
        printWriter.println("RUN mkdir -p /root/.ssh");
        printWriter.println("RUN ssh-keyscan -p 7999 oxfordssh.awsdev.infor.com >> ~/.ssh/known_hosts");
        printWriter.println("RUN eval $(ssh-agent -s) && \\");
        printWriter.println("\tssh-add ~/.ssh/id_rsa_teamcity-e2e && \\");
        printWriter.println(String.format("\tgit clone -b %s ssh://git@oxfordssh.awsdev.infor.com:7999/itech/idm-e2e.git", configuration.getBranch()));
        printWriter.println("");
        printWriter.println("FROM gradle:5.6.2-jdk8");
        printWriter.println("WORKDIR app");
        printWriter.println("COPY ./configuration /home/gradle/app");
        printWriter.println("COPY ./credentials /home/gradle/app");
        printWriter.println("COPY --from=repository /app/idm-e2e/src /home/gradle/app/src");
        printWriter.println("COPY --from=repository /app/idm-e2e/build.gradle /home/gradle/app");
        printWriter.println("COPY --from=repository /app/idm-e2e/src/test/resources/Upload/1.jpg /home/gradle/app");
        printWriter.println("COPY --from=repository /app/idm-e2e/src/test/resources/Upload/2.jpg /home/gradle/app");
        printWriter.println("ENTRYPOINT gradle --rerun-tasks chrome -Pidm.configuration.path=/home/gradle/app/configuration -Pidm.credentials.path=/home/gradle/app/credentials -Premote=http://selenium-hub:4444/wd/hub");
        close();
    }

    public static File getFile(String fileName) {
        ClassLoader loader = FilesResource.class.getClassLoader();
        URL url = loader.getResource(fileName);
        if (url != null) {
            return new File(url.getFile());
        }
        return null;
    }

    public static String getReportsPath() {
        String homeDirectory = System.getProperty("user.home");
        String reportsDirectory = String.format("%s%s%s", homeDirectory, File.separator, REPORTS_DIR);
        File file = new File(reportsDirectory);
        if (!file.exists()) {
            if (file.mkdir()) {
                System.out.println(String.format("%s directory created", reportsDirectory));
            } else {
                System.out.println(String.format("Failed to create %s directory", reportsDirectory));
                reportsDirectory = homeDirectory;
            }
        }
        return reportsDirectory;
    }

    private void close() throws IOException {
        fileWriter.close();
        printWriter.close();
    }

    private void setPrintWriter(String sourceFileName, String targetFileName) throws IOException {
        File file = getFile(sourceFileName);
        if (file == null) {
            throw new IOException(String.format("%s file not found", sourceFileName));
        }
        fileWriter = new FileWriter(String.format("%s%s%s", file.getParent(), File.separator, targetFileName));
        printWriter = new PrintWriter(fileWriter);
    }
}
