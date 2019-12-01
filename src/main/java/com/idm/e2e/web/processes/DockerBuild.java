package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.ProcessLogger;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKERFILE;

public class DockerBuild implements DockerRunnable {
    private E2EConfiguration configuration;
    private Process process;
    private Boolean isFailed = false;
    private String node;

    public DockerBuild(E2EConfiguration configuration) {
        this.configuration = configuration;
    }

    @Override
    public void run() {
        try {
            File file = FilesResource.getFile(DOCKERFILE);
            node = configuration.getNodeID();
            process = DockerCommands.buildImage(file.getAbsolutePath(), node, file.getParent()).start();
            ProcessLogger logger = new ProcessLogger(process);
            logger.log();
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
        this.node = node;
    }
}
