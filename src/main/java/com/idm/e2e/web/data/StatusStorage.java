package com.idm.e2e.web.data;

import com.idm.e2e.web.models.DockerBuildStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class StatusStorage {
    private static HashMap<String, DockerBuildStatus> statuses;

    public static DockerBuildStatus getStatus(String node) {
        if (statuses == null) {
            return getDefaultStatus();
        }
        DockerBuildStatus status = statuses.get(node);
        return status == null ? getDefaultStatus() : status;
    }

    public static void setStatus(String node, DockerBuildStatus status) {
        statuses.put(node, status);
    }

    private static DockerBuildStatus getDefaultStatus() {
        DockerBuildStatus status = new DockerBuildStatus();
        status.setRunning(false);
        status.setCommands(new ArrayList<>());
        status.setMessages(new ArrayList<>());
        status.setStdInput(new ArrayList<>());
        status.setStdError(new ArrayList<>());
        return status;
    }
}
