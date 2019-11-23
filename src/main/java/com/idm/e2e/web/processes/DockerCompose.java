package com.idm.e2e.web.processes;

import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.idm.e2e.web.configuration.AppConstants.*;

public class DockerCompose implements DockerRunnable {
    private Process process;
    private Boolean failed = false;

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
    public void run() {
        try {
            File dockerComposeFile = FilesResource.getFile(DOCKER_COMPOSE_FILE);
            String commandFormat = "docker-compose -f %s up --build --abort-on-container-exit";
            String command = String.format(commandFormat, dockerComposeFile.getAbsolutePath());
            StatusStorage.getCurrentStatus().addCommand(command);
            StatusStorage.getCurrentStatus().setRunning(true);
            StatusStorage.getCurrentStatus().addMessage("Running E2E test suite...");

            ProcessBuilder builder = new ProcessBuilder();
            Map<String, String> environment = builder.environment();
            environment.put("report_directory", FilesResource.getReportsPath());
            builder.command("docker-compose", "-f", dockerComposeFile.getAbsolutePath(), "up", "--build", "--abort-on-container-exit");

            process = builder.start();
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;
            Matcher matcher;
            Pattern pattern = Pattern.compile(".*Scenario.*");
            while ((line = input.readLine()) != null) {
                StatusStorage.getCurrentStatus().addStdInputEntry(line);
                matcher = pattern.matcher(line);
                if (matcher.matches()) {
                    String message = line.substring(line.indexOf("test"));
                    StatusStorage.getCurrentStatus().addMessage(message);
                }
            }
            while ((line = error.readLine()) != null) {
                StatusStorage.getCurrentStatus().addStdErrorEntry(line);
            }
        } catch (IOException e) {
            failed = true;
            StatusStorage.getCurrentStatus().addStdErrorEntry(e.getMessage());
            e.printStackTrace();
        }
    }
}
