package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.E2EConfiguration;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class DockerRun implements DockerRunnable {
    private E2EConfiguration configuration;
    private Process process;
    private Boolean failed = false;
    private String chromeNode;
    private String e2eNode;

    public DockerRun(E2EConfiguration configuration) {
        this.configuration = configuration;
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
        return failed;
    }

    @Override
    public void destroy() {
        if (process != null) {
            process.destroy();
        }
    }

    @Override
    public void setNode(String node) {
        this.chromeNode = node;
    }

    @Override
    public void run() {
        // File dockerComposeFile = FilesResource.getFile(DOCKER_COMPOSE_FILE);
        // e2eNode = configuration.getNodeID();
        chromeNode = DockerCommands.getNewChromeNode();
        ProcessBuilder chromeBuilder = DockerCommands.runChromeNode(chromeNode);
        // Map<String, String> environment = builder.environment();
        // environment.put("report_directory", FilesResource.getReportsPath());

        StatusStorage.getCurrentStatus().addMessage("Running Chrome node " + chromeNode);
        // StatusStorage.getCurrentStatus().setRunning(true);
        StatusStorage.getCurrentStatus().addCommand(chromeBuilder.command().toString());

        try {
            Process chromeProcess = chromeBuilder.start();
             BufferedReader input = new BufferedReader(new InputStreamReader(chromeProcess.getInputStream()));
             BufferedReader error = new BufferedReader(new InputStreamReader(chromeProcess.getErrorStream()));
             String line;
             // Matcher matcher;
             // Pattern pattern = Pattern.compile(".*Scenario.*");
             while ((line = input.readLine()) != null) {
                 System.out.println("Line: " + line);
                // StatusStorage.getCurrentStatus().addStdInputEntry(line);
                //matcher = pattern.matcher(line);
                // if (matcher.matches()) {
                //    String message = line.substring(line.indexOf("test"));
                //    StatusStorage.getCurrentStatus().addMessage(message);
                //}
            }
            while ((line = error.readLine()) != null) {
                System.out.println("Error: " + line);
                // StatusStorage.getCurrentStatus().addStdErrorEntry(line);
            }
        } catch (IOException e) {
            failed = true;
            StatusStorage.getCurrentStatus().addStdErrorEntry(e.getMessage());
            e.printStackTrace();
        }
    }
}
