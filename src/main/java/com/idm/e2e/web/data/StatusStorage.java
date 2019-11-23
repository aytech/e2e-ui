package com.idm.e2e.web.data;

import com.idm.e2e.web.models.DockerBuildStatus;

import java.util.ArrayList;

public class StatusStorage {
    private static DockerBuildStatus previousStatus;
    private static DockerBuildStatus currentStatus;

    public static DockerBuildStatus getPreviousStatus() {
        if (previousStatus == null) {
            previousStatus = getNewStatus();
        }
        return previousStatus;
    }

    public static DockerBuildStatus getCurrentStatus() {
        if (currentStatus == null) {
            currentStatus = getNewStatus();
        }
        return currentStatus;
    }

    public static void setPreviousStatus(DockerBuildStatus previousStatus) {
        StatusStorage.previousStatus = previousStatus;
    }

    public static void setCurrentStatus(DockerBuildStatus currentStatus) {
        StatusStorage.currentStatus = currentStatus;
    }

    public static DockerBuildStatus getStatus() {
        if (getCurrentStatus().isRunning()) {
            return getCurrentStatus();
        }
        return getPreviousStatus();
    }

    private static DockerBuildStatus getNewStatus() {
        DockerBuildStatus status = new DockerBuildStatus();
        status.setRunning(false);
        status.setCommands(new ArrayList<>());
        status.setMessages(new ArrayList<>());
        status.setStdInput(new ArrayList<>());
        status.setStdError(new ArrayList<>());
        return status;
    }
}
