package com.idm.e2e.web.processes;

import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.IOException;

import static com.idm.e2e.web.configuration.AppConstants.*;

public class FileSystemConfiguration implements DockerRunnable {
    private boolean isAlive = false;
    private E2EConfiguration configuration;

    public FileSystemConfiguration(E2EConfiguration configuration) {
        this.configuration = configuration;
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
    public void run() {
        isAlive = true;
        FilesResource resource = new FilesResource(configuration);
        resource.createConfigurationDirectory();
        try {
            resource.copyConfigurationFiles();
            resource.writeNewConfigurationFile(CONFIGURATION);
            resource.writeNewCredentialsFile(CREDENTIALS);
            resource.writeDockerFile(DOCKERFILE);
        } catch (IOException e) {
            System.out.println("Configuration error: " + e);
            e.printStackTrace();
        }
        isAlive = false;
    }
}
