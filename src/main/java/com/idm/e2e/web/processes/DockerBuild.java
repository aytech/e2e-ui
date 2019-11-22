package com.idm.e2e.web.processes;

import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import static com.idm.e2e.web.configuration.AppConstants.DOCKERFILE;

public class DockerBuild implements DockerRunnable {
    private Process process;
    private Boolean isFailed = false;

    @Override
    public void run() {
        try {
            File file = FilesResource.getFile(DOCKERFILE);
            String command = String.format("docker build -f %s -t e2e %s", file.getAbsolutePath(), file.getParent());
            StatusStorage.getCurrentStatus().addCommand(command);
            StatusStorage.getCurrentStatus().setRunning(true);
            StatusStorage.getCurrentStatus().addMessage("Rebuilding Docker image...");

            ProcessBuilder builder = new ProcessBuilder();
            builder.command("docker", "build", "-f", file.getAbsolutePath(), "-t", "e2e", file.getParent());

            process = builder.start();
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String line;
            while ((line = input.readLine()) != null) {
                StatusStorage.getCurrentStatus().addStdInputEntry(line);
            }
            while ((line = error.readLine()) != null) {
                StatusStorage.getCurrentStatus().addStdErrorEntry(line);
            }
        } catch (IOException e) {
            isFailed = true;
            StatusStorage.getCurrentStatus().addStdErrorEntry(e.getMessage());
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
