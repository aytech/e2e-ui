package com.idm.e2e.web.models;

import java.util.ArrayList;

public class DockerBuildStatus {
    private ArrayList<String> commands;
    private ArrayList<String> messages;
    private ArrayList<String> stdInput;
    private ArrayList<String> stdErr;
    private Boolean isReportAvailable;
    private Boolean isRunning;

    public ArrayList<String> getCommands() {
        return commands;
    }

    public void setCommands(ArrayList<String> commands) {
        this.commands = commands;
    }

    public void addCommand(String command) {
        if (commands == null) {
            commands = new ArrayList<>();
        }
        commands.add(command);
    }

    public ArrayList<String> getMessages() {
        return messages;
    }

    public void setMessages(ArrayList<String> messages) {
        this.messages = messages;
    }

    public void addMessage(String message) {
        if (messages == null) {
            messages = new ArrayList<>();
        }
        messages.add(message);
    }

    public ArrayList<String> getStdInput() {
        return stdInput;
    }

    public void setStdInput(ArrayList<String> stdInput) {
        this.stdInput = stdInput;
    }

    public void addStdInputEntry(String entry) {
        if (stdInput == null) {
            stdInput = new ArrayList<>();
        }
        stdInput.add(entry);
    }

    public ArrayList<String> getStdErr() {
        return stdErr;
    }

    public void setStdError(ArrayList<String> stdError) {
        this.stdErr = stdError;
    }

    public void addStdErrorEntry(String entry) {
        if (stdErr == null) {
            stdErr = new ArrayList<>();
        }
        stdErr.add(entry);
    }

    public Boolean getReportAvailable() {
        return isReportAvailable;
    }

    public void setReportAvailable(Boolean reportAvailable) {
        isReportAvailable = reportAvailable;
    }

    public Boolean isRunning() {
        return isRunning;
    }

    public void setRunning(Boolean running) {
        isRunning = running;
    }
}
