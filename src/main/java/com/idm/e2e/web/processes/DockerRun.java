package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.IOException;
import java.util.regex.Pattern;

public class DockerRun implements DockerRunnable {
    private Process chromeProcess;
    private Process e2eProcess;
    private Boolean failed = false;
    private String chromeNodeID;
    private String e2eNodeID;
    private FilesResource filesResource;
    private DockerUtility dockerUtility;

    public DockerRun(E2EConfiguration configuration) {
        e2eNodeID = configuration.getNodeID();
        chromeNodeID = DockerCommands.getNewChromeNode();
        filesResource = new FilesResource(configuration);
        dockerUtility = new DockerUtility();
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
        if (e2eProcess != null) {
            e2eProcess.destroy();
        }
        DockerCommands.stopNode(chromeNodeID);
        DockerCommands.stopNode(e2eNodeID);
        filesResource.cleanConfigurationFiles();
    }

    @Override
    public void setNode(String node) {
        this.chromeNodeID = node;
    }

    @Override
    public void run() {
        ProcessBuilder chromeBuilder = DockerCommands.runChromeNode(chromeNodeID);
        ProcessBuilder e2eBuilder = DockerCommands.runE2ENode(e2eNodeID, filesResource.getReportsPath());

        try {
            dockerUtility.startSeleniumGridContainer();
            chromeProcess = dockerUtility.startContainer(chromeBuilder, e2eNodeID);
            e2eProcess = dockerUtility.startContainer(e2eBuilder, e2eNodeID, Pattern.compile(".*Scenario.*"));
        } catch (IOException | InterruptedException e) {
            failed = true;
            StatusStorage.getStatus(e2eNodeID).addStdErrorEntry(e.getMessage());
            e.printStackTrace();
        }
    }
}
