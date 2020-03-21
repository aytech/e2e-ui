package com.idm.e2e.resources;

import org.apache.commons.lang3.RandomStringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static com.idm.e2e.configuration.DockerConstants.*;

public class DockerCommandsResource extends E2EResource {

    public static ProcessBuilder networkCreate() {
        ArrayList<String> arguments = getArguments();
        arguments.add("network");
        arguments.add("create");
        arguments.add("--driver");
        arguments.add("bridge");
        arguments.add(DOCKER_NETWORK_NAME);
        return getBuilder(arguments);
    }

    public static ProcessBuilder getContainerRunningStatus(String containerName) {
        ArrayList<String> arguments = getArguments();
        arguments.add("inspect");
        arguments.add("-f");
        arguments.add("'{{.State.Running}}'");
        arguments.add(containerName);
        return getBuilder(arguments);
    }

    public static ProcessBuilder getImageListProcess(String imageName) {
        ArrayList<String> arguments = getArguments();
        arguments.add("images");
        arguments.add("-q");
        arguments.add(String.format("%s:latest", imageName));
        return getBuilder(arguments);
    }

    public static ProcessBuilder startSeleniumGrid() {
        ArrayList<String> arguments = getRunArguments(SELENIUM_GRID_CONTAINER_NAME);
        arguments.add("-p");
        arguments.add(String.format("%s:%s", DOCKER_GRID_CONTAINER_PORT, DOCKER_GRID_CONTAINER_PORT));
        arguments.add("-e");
        arguments.add("GRID_TIMEOUT=3000");
        arguments.add("-e");
        arguments.add("GRID_BROWSER_TIMEOUT=0");
        arguments.add("-d");
        arguments.add(SELENIUM_GRID_IMAGE);
        return getBuilder(arguments);
    }

    public ProcessBuilder buildImage(String dockerFile, String imageTag, String contextPath) {
        ArrayList<String> arguments = getArguments();
        arguments.add("build");
        arguments.add("-f");
        arguments.add(dockerFile);
        arguments.add("-t");
        arguments.add(imageTag);
        arguments.add(contextPath);
        return getBuilder(arguments);
    }

    public ProcessBuilder getStopContainerCommand(String containerName) {
        ArrayList<String> arguments = getArguments();
        arguments.add("stop");
        arguments.add(containerName);
        return getBuilder(arguments);
    }

    public ProcessBuilder runChromeNode(String nodeID) {
        ArrayList<String> arguments = getNodeArguments(nodeID, DOCKER_CHROME_VOLUME, DOCKER_CHROME_VOLUME);
        arguments.add("-e");
        arguments.add("SCREEN_WIDTH=1920");
        arguments.add("-e");
        arguments.add("SCREEN_HEIGHT=1080");
        arguments.add("-e");
        arguments.add("SCREEN_DEPTH=32");
        arguments.add("-d");
        arguments.add(CHROME_IMAGE);
        return getBuilder(arguments);
    }

    @Deprecated
    public static ProcessBuilder runE2ENode(String nodeID, String reportsPath) {
        ArrayList<String> arguments = getNodeArguments(nodeID, reportsPath, DOCKER_REPORTS_PATH);
        // This should come from settings
        arguments.add("-e");
        arguments.add("E2E_BASE_URL=https://nlbavwidm3.infor.com/infor");
        arguments.add("-e");
        arguments.add("E2E_ENVIRONMENT=staging");
        arguments.add("-e");
        arguments.add("E2E_DOCUMENT_TYPE=AA");
        arguments.add("-e");
        arguments.add("E2E_FILE_PATH=/home/gradle/app/1.jpg");
        arguments.add("-e");
        arguments.add("E2E_USER=oleg.yapparov@infor.com");
        arguments.add("-e");
        arguments.add("E2E_PASSWORD=foo");
        arguments.add(nodeID);
        return getBuilder(arguments);
    }

    public ProcessBuilder runE2ENode(String nodeID, String reportsPath, HashMap<String, String> envVariables) {
        ArrayList<String> arguments = getNodeArguments(nodeID, reportsPath, DOCKER_REPORTS_PATH);
        arguments.add("-e");
        arguments.add(String.format("%s=%s", DOCKER_UID, getUserUid()));
        for (Map.Entry<String, String> variable : envVariables.entrySet()) {
            arguments.add("-e");
            arguments.add(String.format("%s=%s", variable.getKey(), variable.getValue()));
        }
        arguments.add(nodeID);
        return getBuilder(arguments);
    }

    public static ProcessBuilder prune() {
        ArrayList<String> arguments = getArguments();
        arguments.add("system");
        arguments.add("prune");
        arguments.add("--force");
        return getBuilder(arguments);
    }

    private static ArrayList<String> getArguments() {
        ArrayList<String> arguments = new ArrayList<>();
        arguments.add("docker");
        return arguments;
    }

    private static ArrayList<String> getRunArguments(String nodeID) {
        ArrayList<String> arguments = getArguments();
        arguments.add("run");
        // arguments.add("--rm");
        arguments.add("--name");
        arguments.add(nodeID);
        arguments.add(String.format("--network=%s", DOCKER_NETWORK_NAME));
        return arguments;
    }

    private static ArrayList<String> getNodeArguments(String nodeId, String volumeHost, String volumeContainer) {
        ArrayList<String> arguments = getRunArguments(nodeId);
        arguments.add("-v");
        arguments.add(String.format("%s:%s", volumeHost, volumeContainer));
        arguments.add("-e");
        arguments.add(String.format("HUB_HOST=%s", SELENIUM_GRID_CONTAINER_NAME));
        arguments.add("-e");
        arguments.add(String.format("HUB_PORT=%s", DOCKER_GRID_CONTAINER_PORT));
        return arguments;
    }

    public static ProcessBuilder getBuilder(ArrayList<String> command) {
        ProcessBuilder builder = new ProcessBuilder();
        builder.command(command);
        return builder;
    }

    public String getNewNodeID() {
        return RandomStringUtils.random(10, false, true);
    }
}
