package com.idm.e2e.loggers;

import com.idm.e2e.data.StatusStorage;
import com.idm.e2e.models.DockerBuildStatus;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.idm.e2e.configuration.DockerConstants.*;

public class ProcessLogger {
    private Process process;

    public ProcessLogger(Process process) {
        this.process = process;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    public void log(String nodeID, Boolean withSort) throws IOException {
        String line;
        DockerBuildStatus status = StatusStorage.getStatus(nodeID);
        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((line = input.readLine()) != null) {
            status.addStdInputEntry(line);
            if (withSort) {
                sortStatusMessages(line, status);
            }
            System.out.println("Input: " + line);
        }
        while ((line = error.readLine()) != null) {
            status.addStdErrorEntry(line);
            System.out.println("Error: " + line);
        }
    }

    public void log(String nodeID) throws IOException {
        log(nodeID, false);
    }

    private void sortStatusMessages(String inputMessage, DockerBuildStatus status) {
        Pattern messagesPassedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_PASSED);
        Pattern messagesFailedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_FAILED);
        Pattern messagesSkippedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_SKIPPED);
        Pattern messagesPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE);

        Matcher messagesPassedMatcher = messagesPassedPattern.matcher(inputMessage);
        Matcher messagesFailedMatcher = messagesFailedPattern.matcher(inputMessage);
        Matcher messagesSkippedMatcher = messagesSkippedPattern.matcher(inputMessage);
        Matcher messagesMatcher = messagesPattern.matcher(inputMessage);

        if (messagesPassedMatcher.matches()) {
            status.addMessagePassed(inputMessage);
        }
        if (messagesFailedMatcher.matches()) {
            status.addMessageFailed(inputMessage);
        }
        if (messagesSkippedMatcher.matches()) {
            status.addMessageSkipped(inputMessage);
        }
        if (messagesMatcher.matches()) {
            status.addMessage(inputMessage);
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

    public String getLogString() {
        try {
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = input.readLine();
            if (line != null) {
                return line.replaceAll("'", "");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
