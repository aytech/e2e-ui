package com.idm.e2e.data;

import com.idm.e2e.models.DockerBuildStatus;

import java.util.ArrayList;
import java.util.HashMap;

public class StatusStorage {
    private static HashMap<String, DockerBuildStatus> statuses;

    public static DockerBuildStatus getStatus(String node) {
        if (statuses == null) {
            return getDefaultStatus();
        }
        DockerBuildStatus status = statuses.get(node);
        return status == null ? getDefaultStatus() : status;
    }

    public static void setStatus(String node) {
        if (statuses == null) {
            statuses = new HashMap<>();
        }
        statuses.put(node, getDefaultStatus());
    }

    private static DockerBuildStatus getDefaultStatus() {
        DockerBuildStatus status = new DockerBuildStatus();
        status.setRunning(false);
        status.setCommands(new ArrayList<>());
        status.setMessages(new ArrayList<>());
        status.setMessagesFailed(new ArrayList<>());
        status.setMessagesPassed(new ArrayList<>());
        status.setMessagesSkipped(new ArrayList<>());
        status.setStdInput(new ArrayList<>());
        status.setStdError(new ArrayList<>());
        return status;
    }
}
