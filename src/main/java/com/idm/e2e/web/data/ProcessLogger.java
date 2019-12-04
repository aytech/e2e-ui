package com.idm.e2e.web.data;

import com.idm.e2e.web.models.DockerBuildStatus;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ProcessLogger {
    private Process process;

    public ProcessLogger(Process process) {
        this.process = process;
    }

    public void log(String nodeID, Pattern pattern) throws IOException {
        String line;
        DockerBuildStatus status = StatusStorage.getStatus(nodeID);
        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((line = input.readLine()) != null) {
            status.addStdInputEntry(line);
            addStatusMessage(line, pattern, status);
            System.out.println("Input: " + line);
        }
        while ((line = error.readLine()) != null) {
            status.addStdErrorEntry(line);
            System.out.println("Error: " + line);
        }
    }

    public void log(String nodeID) throws IOException {
        log(nodeID, null);
    }

    private void addStatusMessage(String message, Pattern pattern, DockerBuildStatus status) {
        if (pattern == null) {
            return;
        }
        Matcher matcher = pattern.matcher(message);
        if (matcher.matches()) {
            status.addMessage(message);
        }
    }

    public Boolean getLogBoolean() {
        try {
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = input.readLine()) != null) {
                if (Boolean.parseBoolean(line.replaceAll("'", ""))) {
                    return true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public Integer getLogNumber() {
        try {
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
//            while ((line = input.readLine()) != null) {
                return Integer.parseInt(input.readLine().replaceAll("'", ""));
//            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return 0;
    }
}
