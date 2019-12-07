package com.idm.e2e.web.models;

import java.util.ArrayList;

@SuppressWarnings("unused")
public class DockerBuildStatus {
    private ArrayList<String> commands;
    private ArrayList<String> messages;
    private ArrayList<String> messagesFailed;
    private ArrayList<String> messagesPassed;
    private ArrayList<String> messagesSkipped;
    private ArrayList<String> stdInput;
    private ArrayList<String> stdErr;
    private long startedTimestamp;
    private long finishedTimestamp;
    private Boolean canBeStopped;
    private Boolean isReportAvailable;
    private Boolean isRunning;

    public Boolean getRunning() {
        return isRunning;
    }

    public void setStdErr(ArrayList<String> stdErr) {
        this.stdErr = stdErr;
    }

    public long getFinishedTimestamp() {
        return finishedTimestamp;
    }

    public void setFinishedTimestamp(long finishedTimestamp) {
        this.finishedTimestamp = finishedTimestamp;
    }

    public long getStartedTimestamp() {
        return startedTimestamp;
    }

    public void setStartedTimestamp(long startedTimestamp) {
        this.startedTimestamp = startedTimestamp;
    }

    public ArrayList<String> getMessagesFailed() {
        return messagesFailed;
    }

    public void setMessagesFailed(ArrayList<String> messagesFailed) {
        this.messagesFailed = messagesFailed;
    }

    public void addMessageFailed(String message) {
        if (messagesFailed == null) {
            messagesFailed = new ArrayList<>();
        }
        messagesFailed.add(message);
    }

    public ArrayList<String> getMessagesPassed() {
        return messagesPassed;
    }

    public void setMessagesPassed(ArrayList<String> messagesPassed) {
        this.messagesPassed = messagesPassed;
    }

    public void addMessagePassed(String message) {
        if (messagesPassed == null) {
            messagesPassed = new ArrayList<>();
        }
        messagesPassed.add(message);
    }

    public ArrayList<String> getMessagesSkipped() {
        return messagesSkipped;
    }

    public void setMessagesSkipped(ArrayList<String> messagesSkipped) {
        this.messagesSkipped = messagesSkipped;
    }

    public void addMessageSkipped(String message) {
        if (messagesSkipped == null) {
            messagesSkipped = new ArrayList<>();
        }
        messagesSkipped.add(message);
    }

    public Boolean getCanBeStopped() {
        return canBeStopped;
    }

    public void setCanBeStopped(Boolean canBeStopped) {
        this.canBeStopped = canBeStopped;
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
