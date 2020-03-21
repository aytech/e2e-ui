package com.idm.e2e.resources;

import com.idm.e2e.models.E2EConfiguration;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import static com.idm.e2e.configuration.AppConstants.*;
import static com.idm.e2e.configuration.DockerConstants.*;

public class FilesResource extends E2EResource {

    private E2EConfiguration configuration;
    private PrintWriter printWriter;
    private FileWriter fileWriter;
    private String nodeId;

    public FilesResource(E2EConfiguration configuration) {
        this.configuration = configuration;
    }

    public FilesResource(String nodeId) {
        this.nodeId = nodeId;
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

    public void writeBaseDockerFile() throws IOException {
        File entrypointFile = getFileFromNodeDirectory(DOCKER_ENTRYPOINT);
        FileWriter entrypointFileWriter = new FileWriter(
                String.format("%s%s%s", entrypointFile.getParent(), File.separator, DOCKER_ENTRYPOINT));
        PrintWriter entrypointPrintWriter = new PrintWriter(entrypointFileWriter);
        entrypointPrintWriter.println("#!/bin/sh");
        entrypointPrintWriter.println(String.format("USER_ID=${%s:-%s}", DOCKER_UID, DOCKER_UID_DEFAULT));
        entrypointPrintWriter.println("adduser -s /bin/sh -u \"$USER_ID\" -D user");
        entrypointPrintWriter.println("export HOME=/home/user");
        entrypointPrintWriter.println("exec /usr/local/bin/gosu user \"$@\"");
        entrypointPrintWriter.close();
        entrypointFileWriter.close();

        File dockerFile = getFileFromNodeDirectory(DOCKERFILE_BASE);
        FileWriter dockerFileWriter = new FileWriter(
                String.format("%s%s%s", dockerFile.getParent(), File.separator, DOCKERFILE_BASE));
        PrintWriter dockerPrintWriter = new PrintWriter(dockerFileWriter);
        dockerPrintWriter.println("FROM alpine");
        dockerPrintWriter.println("RUN apk update && \\");
        dockerPrintWriter.println("\tapk upgrade && \\");
        dockerPrintWriter.println("\tapk add --no-cache gnupg && \\");
        dockerPrintWriter.println("\tapk add dpkg ca-certificates curl");
        dockerPrintWriter.println("RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4");
        dockerPrintWriter.println("RUN curl -o /usr/local/bin/gosu -SL \"https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }')\" \\");
        dockerPrintWriter.println("&& curl -o /usr/local/bin/gosu.asc -SL \"https://github.com/tianon/gosu/releases/download/1.4/gosu-$(dpkg --print-architecture | awk -F- '{ print $NF }').asc\" \\");
        dockerPrintWriter.println("&& gpg --verify /usr/local/bin/gosu.asc \\");
        dockerPrintWriter.println("&& rm /usr/local/bin/gosu.asc \\");
        dockerPrintWriter.println("&& chmod +x /usr/local/bin/gosu");
        dockerPrintWriter.println("COPY entrypoint.sh /usr/local/bin/entrypoint.sh");
        dockerPrintWriter.println("RUN chmod +x /usr/local/bin/entrypoint.sh");
        dockerPrintWriter.println("ENTRYPOINT [\"/usr/local/bin/entrypoint.sh\"]");
        dockerPrintWriter.close();
        dockerFileWriter.close();
    }

    public void writeDockerFile(String repositoryUrl, String branchName) throws IOException {
        String uid = getUserUid();
        File dockerFile = getFileFromNodeDirectory(DOCKERFILE);
        FileWriter dockerFileWriter = new FileWriter(
                String.format("%s%s%s", dockerFile.getParent(), File.separator, DOCKERFILE));
        PrintWriter dockerPrintWriter = new PrintWriter(dockerFileWriter);

        dockerPrintWriter.println("FROM e2e-base");
        dockerPrintWriter.println("WORKDIR app");
        dockerPrintWriter.println("RUN apk update && \\");
        dockerPrintWriter.println("\tapk upgrade && \\");
        dockerPrintWriter.println("\tapk add git openssh openjdk8");
        dockerPrintWriter.println(String.format("RUN git clone -b %s %s .", branchName, repositoryUrl));
        dockerPrintWriter.println("RUN mkdir -p /app/build/reports");
        dockerPrintWriter.println(String.format("RUN chown -R %s:%s /app", uid, uid));
        dockerPrintWriter.println("RUN chmod +x gradlew");
        dockerPrintWriter.println("CMD [\"./gradlew\", \"--rerun-tasks\", \"chrome\", \"-Premote=http://selenium-hub:4444/wd/hub\"]");

        dockerPrintWriter.close();
        dockerFileWriter.close();
    }

    public void copyRsaFile() throws IOException {
        File targetDirectory = getNodeDirectory();
        String sourceFile = String.format("/%s/%s", RSA_DIR, RSA_FILE);
        InputStream sourceRSA = FilesResource.class.getResourceAsStream(sourceFile);

        if (sourceRSA == null) {
            throw new IOException("Cannot get source file at " + sourceFile);
        }

        String targetRSA = String.format("%s%s%s", targetDirectory.getPath(), File.separator, RSA_FILE);
        Files.copy(sourceRSA, Paths.get(targetRSA), StandardCopyOption.REPLACE_EXISTING);
    }

    @Deprecated
    public File getFile(String fileName) throws IOException {
        File file = getConfigurationDirectory(fileName);
        if (!file.exists()) {
            if (file.createNewFile()) {
                System.out.println(String.format("%s file created", file.getPath()));
            } else {
                System.out.println(String.format("Failed to create %s file", file.getPath()));
            }
        }
        return file;
    }

    public File getNodeDirectory() {
        File path = getNodePath();
        if (!path.exists()) {
            Boolean isCreated = path.mkdir();
            Boolean isReadable = path.setReadable(true, false);
            Boolean isWritable = path.setWritable(true, false);
            Boolean isExecutable = path.setExecutable(true, false);
            if (isCreated && isReadable && isWritable && isExecutable) {
                System.out.println(String.format("%s file created", path.getPath()));
            } else {
                System.out.println(String.format("Failed to create %s file", path.getPath()));
            }
        }
        return path;
    }

    public File getFileFromNodeDirectory(String fileName) {
        File path = getNodeDirectory();
        String basePath = String.format(
                "%s%s%s",
                path.getAbsolutePath(),
                File.separator,
                fileName
        );
        return new File(basePath);
    }

    public File getTestReportDirectory() {
        return getFileFromNodeDirectory(REPORT_DIR);
    }

    public void createConfigurationDirectory(String subDirectory) {
        File directory = getConfigurationDirectory(subDirectory);
        if (!directory.exists()) {
            if (directory.mkdir()) {
                System.out.println(String.format("%s directory created", directory.getPath()));
            } else {
                System.out.println(String.format("Failed to create %s directory", directory.getPath()));
            }
        } else {
            if (directory.delete()) {
                createConfigurationDirectory(subDirectory);
            }
        }
    }

    /*
     * Get configuration directory in format <home directory>/e2e
     * Deprecated, use {#getNodeConfigurationDirectory} instead
     */
    @Deprecated
    public File getConfigurationDirectory(String subDirectory) {
        String homeDirectory = System.getProperty("user.home");
        String basePath = String.format(
                "%s%s%s%s%s",
                homeDirectory,
                File.separator,
                CONFIGURATION_DIRECTORY,
                File.separator,
                configuration.getNodeID()
        );
        if (subDirectory == null) {
            return new File(basePath);
        }
        return new File(String.format("%s%s%s", basePath, File.separator, subDirectory));
    }

    public File getNodePath() {
        String homeDirectory = System.getProperty("user.home");
        String basePath = String.format(
                "%s%s%s%s%s",
                homeDirectory,
                File.separator,
                CONFIGURATION_DIRECTORY,
                File.separator,
                nodeId
        );
        return new File(basePath);
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
