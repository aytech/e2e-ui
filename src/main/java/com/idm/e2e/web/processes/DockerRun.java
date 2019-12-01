package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.ProcessLogger;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.IOException;

public class DockerRun implements DockerRunnable {
    private Process chromeProcess;
    private Process e2eProcess;
    private Boolean failed = false;
    private String chromeNodeID;
    private String e2eNodeID;
    private String reportsPath;

    public DockerRun(E2EConfiguration configuration) {
        e2eNodeID = configuration.getNodeID();
        chromeNodeID = DockerCommands.getNewChromeNode();
        FilesResource filesResource = new FilesResource(configuration);
        reportsPath = filesResource.getReportsPath();
    }

    @Override
    public Process getProcess() {
        return e2eProcess;
    }

    @Override
    public Boolean isAlive() {
        return e2eProcess != null && e2eProcess.isAlive();
    }

    public Boolean isFailed() {
        return failed;
    }

    @Override
    public void destroy() {
        if (chromeProcess != null) {
            chromeProcess.destroy();
        }
        DockerCommands.stopNode(chromeNodeID);
        DockerCommands.stopNode(e2eNodeID);
    }

    @Override
    public void setNode(String node) {
        this.chromeNodeID = node;
    }

    @Override
    public void run() {
        ProcessBuilder chromeBuilder = DockerCommands.runChromeNode(chromeNodeID);
        ProcessBuilder e2eBuilder = DockerCommands.runE2ENode(e2eNodeID, reportsPath);

        try {
            chromeProcess = chromeBuilder.start();
            ProcessLogger logger = new ProcessLogger(chromeProcess);
            logger.log(e2eNodeID);
            chromeProcess.waitFor();

            e2eProcess = e2eBuilder.start();
            logger = new ProcessLogger(e2eProcess);
            logger.log(e2eNodeID);
            e2eProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            failed = true;
            StatusStorage.getStatus(e2eNodeID).addStdErrorEntry(e.getMessage());
            e.printStackTrace();
        }
    }
}
