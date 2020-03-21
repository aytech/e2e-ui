package com.idm.e2e.processes;

import com.idm.e2e.resources.FilesResource;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.models.E2EConfiguration;

import java.io.IOException;

import static com.idm.e2e.configuration.AppConstants.*;

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
    public void run() {
        isAlive = true;
        fileResource.createConfigurationDirectory(null);
        try {
            fileResource.writeNewConfigurationFile(CONFIGURATION);
            fileResource.writeNewCredentialsFile(CREDENTIALS);
        } catch (IOException e) {
            System.out.println("Configuration error: " + e);
            e.printStackTrace();
        }
        isAlive = false;
    }
}
