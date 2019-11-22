package com.idm.e2e.web.data;

import com.idm.e2e.web.models.E2EConfiguration;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;

import static com.idm.e2e.web.configuration.AppConstants.*;

public class FilesResource {

    private E2EConfiguration configuration;
    private PrintWriter printWriter;
    private FileWriter fileWriter;

    public FilesResource(E2EConfiguration configuration) {
        this.configuration = configuration;
    }

    public void writeNewConfigurationFile(String targetFileName) throws IOException {
        setPrintWriter(targetFileName);
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

    public void writeNewCredentialsFile(String targetFileName) throws IOException {
        setPrintWriter(targetFileName);
        printWriter.println(String.format("%s=%s", E2EConfiguration.USER, configuration.getUser()));
        printWriter.println(String.format("%s=%s", E2EConfiguration.PASSWORD, configuration.getPassword()));
        close();
    }

    public void writeDockerFile(String targetFileName) throws IOException {
        setPrintWriter(targetFileName);
        printWriter.println("FROM alpine as repository");
        printWriter.println(String.format("LABEL maintainer=\"%s\"", MAINTAINER));
        printWriter.println("WORKDIR app");
        printWriter.println("RUN apk update && \\");
        printWriter.println("\tapk upgrade && \\");
        printWriter.println("\tapk add git openssh");
        printWriter.println("COPY ./id_rsa_teamcity-e2e /root/.ssh/");
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

    public void copyConfigurationFiles() throws IOException {
        String homeDirectory = System.getProperty("user.home");
        String configurationDirectory = String.format("%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY);

        InputStream sourceCompose = getClass().getResourceAsStream(String.format("%s%s", File.separator, DOCKER_COMPOSE_FILE));
        InputStream sourceRSA = getClass().getResourceAsStream(String.format("%s%s%s%s", File.separator, RSA_DIR, File.separator, RSA_FILE));

        String targetCompose = String.format("%s%s%s", configurationDirectory, File.separator, DOCKER_COMPOSE_FILE);
        String targetRSA = String.format("%s%s%s", configurationDirectory, File.separator, RSA_FILE);

        Files.copy(sourceCompose, Paths.get(targetCompose), StandardCopyOption.REPLACE_EXISTING);
        Files.copy(sourceRSA, Paths.get(targetRSA), StandardCopyOption.REPLACE_EXISTING);
    }

    public static File getFile(String fileName) throws IOException {
        String homeDirectory = System.getProperty("user.home");
        String filePath = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, fileName);
        File file = new File(filePath);
        if (!file.exists()) {
            if (file.createNewFile()) {
                System.out.println(String.format("%s file created", filePath));
            } else {
                System.out.println(String.format("Failed to create %s file", filePath));
            }
        }
        return file;
    }

    public static String getReportsPath() {
        String homeDirectory = System.getProperty("user.home");
        String reportsDirectory = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, REPORTS_DIR);
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

    public void createConfigurationDirectory() {
        String homeDirectory = System.getProperty("user.home");
        String configurationDirectory = String.format("%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY);
        File directory = new File(configurationDirectory);
        if (!directory.exists()) {
            if (directory.mkdir()) {
                System.out.println(String.format("%s directory created", configurationDirectory));
            } else {
                System.out.println(String.format("Failed to create %s directory", configurationDirectory));
            }
        } else {
            if (directory.delete()) {
                createConfigurationDirectory();
            }
        }
    }

    public void cleanFileSystem() {
        String homeDirectory = System.getProperty("user.home");
        ArrayList<String> paths = new ArrayList<>();
        paths.add(String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, CONFIGURATION));
        paths.add(String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, CREDENTIALS));
        paths.add(String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, DOCKERFILE));

        for (String path : paths) {
            System.out.println("Removing " + path);
            File file = new File(path);
            if (file.exists()) {
                if (file.delete()) {
                    System.out.println(String.format("File %s was removed", file.getName()));
                }
            }
        }
    }

    private void close() throws IOException {
        fileWriter.close();
        printWriter.close();
    }

    private void setPrintWriter(String targetFileName) throws IOException {
        File file = getFile(targetFileName);
        fileWriter = new FileWriter(String.format("%s%s%s", file.getParent(), File.separator, targetFileName));
        printWriter = new PrintWriter(fileWriter);
    }
}
