package com.idm.e2e.web.processes;

import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.IOException;

import static com.idm.e2e.web.configuration.AppConstants.*;
import static com.idm.e2e.web.configuration.DockerConstants.DOCKERFILE;

public class FileSystemConfiguration implements DockerRunnable {
    private boolean isAlive = false;
    private FilesResource fileResource;

    public FileSystemConfiguration(E2EConfiguration configuration) {
        fileResource = new FilesResource(configuration);
    }

    @Override
    public Process getProcess() {
        return null;
    }

    @Override
    public Boolean isAlive() {
        return isAlive;
    }

    @Override
    public Boolean isFailed() {
        return false;
    }

    @Override
    public void destroy() {
    }

    @Override
    public void setNode(String node) {
    }

    @Override
    public void run() {
        isAlive = true;
        fileResource.createConfigurationDirectory(null);
        try {
            fileResource.copyConfigurationFiles();
            fileResource.writeNewConfigurationFile(CONFIGURATION);
            fileResource.writeNewCredentialsFile(CREDENTIALS);
            fileResource.writeDockerFile(DOCKERFILE);
        } catch (IOException e) {
            System.out.println("Configuration error: " + e);
            e.printStackTrace();
        }
        isAlive = false;
    }
}
