package com.idm.e2e.data;

import com.idm.e2e.models.E2EConfiguration;
import org.apache.commons.io.FileUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import static com.idm.e2e.configuration.AppConstants.*;
import static com.idm.e2e.configuration.DockerConstants.DOCKERFILE;
import static com.idm.e2e.configuration.DockerConstants.DOCKER_WORK_DIRECTORY;

public class FilesResource {

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

    public FilesResource() {
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

    public boolean writeDockerFile(String branchName) throws IOException {
        loadPrintWriter(branchName);
        boolean readable = getDockerFile().setReadable(true, false);
        boolean writable = getDockerFile().setWritable(true, false);
        boolean executable = getDockerFile().setExecutable(true, false);
        return readable && writable && executable;
    }

    private void loadPrintWriter(String branchName) throws IOException {
        File file = getDockerFile();
        fileWriter = new FileWriter(String.format("%s%s%s", file.getParent(), File.separator, DOCKERFILE));
        printWriter = new PrintWriter(fileWriter);
        printWriter.println("FROM alpine as repository");
        printWriter.println(String.format("LABEL maintainer=\"%s\"", MAINTAINER));
        printWriter.println("WORKDIR app");
        printWriter.println("RUN apk update && \\");
        printWriter.println("\tapk upgrade && \\");
        printWriter.println("\tapk add git openssh gradle");
        // printWriter.println("COPY ./id_rsa_teamcity-e2e /root/.ssh/");
        // printWriter.println("RUN chmod 400 /root/.ssh/id_rsa_teamcity-e2e");
        // printWriter.println("RUN mkdir -p /root/.ssh");
        // printWriter.println("RUN ssh-keyscan -p 7999 oxfordssh.awsdev.infor.com >> ~/.ssh/known_hosts");
        // printWriter.println("RUN eval $(ssh-agent -s) && \\");
        // printWriter.println("\tssh-add ~/.ssh/id_rsa_teamcity-e2e && \\");
        // printWriter.println(String.format("\tgit clone -b %s ssh://git@oxfordssh.awsdev.infor.com:7999/itech/idm-e2e.git", branchName));
        printWriter.println(String.format("RUN git clone -b %s https://github.com/aytech/idm-e2e.git", branchName));
        printWriter.println("");
        printWriter.println("FROM gradle:5.6.2-jdk8");
        printWriter.println("WORKDIR app");
        printWriter.println(String.format("COPY --from=repository /app/idm-e2e/src %s/src", DOCKER_WORK_DIRECTORY));
        printWriter.println(String.format("COPY --from=repository /app/idm-e2e/build.gradle %s", DOCKER_WORK_DIRECTORY));
        printWriter.println(String.format("COPY --from=repository /app/idm-e2e/src/test/resources/Upload/1.jpg %s", DOCKER_WORK_DIRECTORY));
        printWriter.println(String.format("COPY --from=repository /app/idm-e2e/src/test/resources/Upload/2.jpg %s", DOCKER_WORK_DIRECTORY));
        printWriter.println("ENTRYPOINT gradle --rerun-tasks chrome -Pidm.configuration.path=/home/gradle/app/configuration -Pidm.credentials.path=/home/gradle/app/credentials -Premote=http://selenium-hub:4444/wd/hub");
        close();
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

    private File getFileFromNodeDirectory(String fileName) {
        File path = getNodeDirectory();
        String basePath = String.format(
                "%s%s%s",
                path.getAbsolutePath(),
                File.separator,
                fileName
        );
        return new File(basePath);
    }

    public File getDockerFile() {
        return getFileFromNodeDirectory(DOCKERFILE);
    }

    public File getRsaFile() {
        return getFileFromNodeDirectory(RSA_FILE);
    }

    public File getTestReportDirectory() {
        return getFileFromNodeDirectory(REPORT_DIR);
    }

    public String getReportsPath() {
        createConfigurationDirectory(null);
        return getConfigurationDirectory(null).getPath();
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

    public void cleanConfigurationFiles() {
        for (String path : getConfigurationFiles()) {
            File file = new File(path);
            if (file.exists() && file.delete()) {
                System.out.println(String.format("File %s was removed", file.getName()));
            }
        }
    }

    private List<String> getConfigurationFiles() {
        String configurationDirectory = getConfigurationDirectory(null).getPath();
        ArrayList<String> paths = new ArrayList<>();
        paths.add(String.format("%s%s%s", configurationDirectory, File.separator, CONFIGURATION));
        paths.add(String.format("%s%s%s", configurationDirectory, File.separator, CREDENTIALS));
        paths.add(String.format("%s%s%s", configurationDirectory, File.separator, DOCKERFILE));
        paths.add(String.format("%s%s%s", configurationDirectory, File.separator, RSA_FILE));
        return paths;
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

    public void removeDockerFile() throws IOException {
        FileUtils.forceDelete(getDockerFile());
    }

    public void removeRsaFile() throws IOException {
        FileUtils.forceDelete(getRsaFile());
    }
}
