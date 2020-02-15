package com.idm.e2e.processes;

import com.idm.e2e.resources.DockerCommandsResource;
import com.idm.e2e.data.FilesResource;
import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.models.E2EConfiguration;

import java.io.File;
import java.io.IOException;

import static com.idm.e2e.configuration.DockerConstants.DOCKERFILE;
import static com.idm.e2e.configuration.DockerConstants.DOCKER_E2E_NODE;

public class DockerBuild implements DockerRunnable {
    private Process process;
    private Boolean isFailed = false;
    private String logID;
    private FilesResource filesResource;

    public DockerBuild(E2EConfiguration configuration) {
        logID = configuration.getNodeID();
        filesResource = new FilesResource(configuration);
    }

    @Override
    public void run() {
        try {
            File file = filesResource.getFile(DOCKERFILE);
            String dockerFilePath = file.getAbsolutePath();
            String dockerContext = file.getParent();
            String imageTag = String.format(DOCKER_E2E_NODE, logID);

            process = DockerCommandsResource.buildImage(dockerFilePath, imageTag, dockerContext).start();

            ProcessLogger logger = new ProcessLogger(process);
            logger.log(logID);
        } catch (IOException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }

    @Override
    public Process getProcess() {
        return process;
    }

    @Override
    public Boolean isAlive() {
        return process != null && process.isAlive();
    }

    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        if (process != null) {
            process.destroy();
        }
    }
}
