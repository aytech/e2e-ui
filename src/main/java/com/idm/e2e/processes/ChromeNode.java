package com.idm.e2e.processes;

import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.resources.DockerCommandsResource;

import java.io.IOException;

public class ChromeNode implements DockerRunnable {

    private Process chromeProcess;
    private Boolean isFailed;
    protected String nodeID;

    public ChromeNode() {
        isFailed = false;
        nodeID = DockerCommandsResource.getNewNodeID();
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        return chromeProcess != null && chromeProcess.isAlive();
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        if (chromeProcess != null) {
            chromeProcess.destroy();
        }
    }

    @Override
    public void run() {
        try {
            System.out.println("Start Chrome");
            chromeProcess = DockerCommandsResource.runChromeNode("chrome_" + nodeID).start();
            ProcessLogger chromeLogger = new ProcessLogger(chromeProcess);
            chromeLogger.log(nodeID);
            chromeProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }
}
