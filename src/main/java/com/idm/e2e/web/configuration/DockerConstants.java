package com.idm.e2e.web.configuration;

public class DockerConstants {
    public static final String CHROME_IMAGE = "selenium/node-chrome:3.141.59-vanadium";
    public static final String DOCKERFILE = "Dockerfile";
    public static final String DOCKER_CHROME_NODE_PREFIX = "chrome";
    public static final String DOCKER_CHROME_VOLUME = "/dev/shm";
    public static final String DOCKER_E2E_NODE_PREFIX = "e2e-node";
    public static final String DOCKER_GRID_CONTAINER_NAME = "selenium-hub";
    public static final String DOCKER_GRID_CONTAINER_PORT = "4444";
    public static final String DOCKER_NETWORK_NAME = "e2e-network";
    public static final String DOCKER_WORK_DIRECTORY = "/home/gradle/app";
    public static final String DOCKER_REPORTS_PATH = DOCKER_WORK_DIRECTORY + "/build/reports";
    public static final String SELENIUM_GRID_IMAGE = "selenium/hub:3.141.59-vanadium";
}
