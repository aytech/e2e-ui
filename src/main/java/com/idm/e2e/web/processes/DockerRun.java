package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.IOException;
import java.util.regex.Pattern;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_CHROME_NODE;
import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_E2E_NODE;

public class DockerRun implements DockerRunnable {
    private Process chromeProcess;
    private Process e2eProcess;
    private Boolean failed = false;
    private String chromeNodeID;
    private String e2eNodeID;
    private String logID;
    private FilesResource filesResource;
    private DockerUtility dockerUtility;

    public DockerRun(E2EConfiguration configuration) {
        e2eNodeID = String.format(DOCKER_E2E_NODE, configuration.getNodeID());
        chromeNodeID = String.format(DOCKER_CHROME_NODE, configuration.getNodeID());
        logID = configuration.getNodeID();
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
    public void run() {
        ProcessBuilder chromeBuilder = DockerCommands.runChromeNode(chromeNodeID);
        ProcessBuilder e2eBuilder = DockerCommands.runE2ENode(e2eNodeID, filesResource.getReportsPath());

        try {
            dockerUtility.startSeleniumGridContainer();
            chromeProcess = dockerUtility.startContainer(chromeBuilder, logID);
            e2eProcess = dockerUtility.startContainer(e2eBuilder, logID, Pattern.compile(".*Scenario.*"));
        } catch (IOException | InterruptedException e) {
            failed = true;
            StatusStorage.getStatus(logID).addStdErrorEntry(e.getMessage());
            e.printStackTrace();
        }
    }
}
