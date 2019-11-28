package com.idm.e2e.web.configuration;

import java.util.ArrayList;

import static com.idm.e2e.web.configuration.DockerConstants.*;

public class DockerCommands {

    public static ProcessBuilder networkCreate() {
        ProcessBuilder builder = new ProcessBuilder();
        ArrayList<String> arguments = getArguments();
        arguments.add("network");
        arguments.add("create");
        arguments.add("--driver");
        arguments.add("bridge");
        arguments.add(DOCKER_NETWORK_NAME);
        builder.command(arguments);
        return builder;
    }

    public static ProcessBuilder getRunningStatus() {
        ProcessBuilder builder = new ProcessBuilder();
        ArrayList<String> arguments = getArguments();
        arguments.add("inspect");
        arguments.add("-f");
        arguments.add("'{{.State.Running}}'");
        arguments.add(DOCKER_GRID_CONTAINER_NAME);
        builder.command(arguments);
        return builder;
    }

    public static ProcessBuilder startSeleniumGrid() {
        ProcessBuilder builder = new ProcessBuilder();
        ArrayList<String> arguments = getArguments();
        arguments.add("run");
        arguments.add("--name");
        arguments.add(DOCKER_GRID_CONTAINER_NAME);
        arguments.add(String.format("--network=%s", DOCKER_NETWORK_NAME));
        arguments.add("-p");
        arguments.add("4444:4444");
        arguments.add("-e");
        arguments.add("GRID_TIMEOUT=3000");
        arguments.add("-e");
        arguments.add("GRID_BROWSER_TIMEOUT=0");
        arguments.add("-d");
        arguments.add(SELENIUM_GRID_IMAGE);
        return builder;
    }

    private static ArrayList<String> getArguments() {
        ArrayList<String> arguments = new ArrayList<>();
        arguments.add("docker");
        return arguments;
    }
}
