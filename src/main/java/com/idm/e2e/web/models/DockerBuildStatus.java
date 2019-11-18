package com.idm.e2e.web.models;

import java.util.ArrayList;

public class DockerBuildStatus {
    private ArrayList<String> commands;
    private ArrayList<String> messages;
    private ArrayList<String> stdInput;
    private ArrayList<String> stdError;
    private Boolean isRunning;

    public void setRunning(Boolean running) {
        isRunning = running;
    }

    public Boolean isRunning() {
        return isRunning;
    }

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

    public ArrayList<String> getStdError() {
        return stdError;
    }

    public void setStdError(ArrayList<String> stdError) {
        this.stdError = stdError;
    }

    public void addStdErrorEntry(String entry) {
        if (stdError == null) {
            stdError = new ArrayList<>();
        }
        stdError.add(entry);
    }
}
