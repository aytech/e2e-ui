package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.ProcessLogger;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.File;
import java.io.IOException;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKERFILE;

public class DockerBuild implements DockerRunnable {
    private Process process;
    private Boolean isFailed = false;
    private String nodeID;
    private FilesResource filesResource;

    public DockerBuild(E2EConfiguration configuration) {
        nodeID = configuration.getNodeID();
        filesResource = new FilesResource(configuration);
    }

    @Override
    public void run() {
        try {
            File file = filesResource.getFile(DOCKERFILE);
            process = DockerCommands.buildImage(file.getAbsolutePath(), nodeID, file.getParent()).start();
            ProcessLogger logger = new ProcessLogger(process);
            logger.log(nodeID);
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

    @Override
    public void setNode(String node) {
        this.nodeID = node;
    }
}
