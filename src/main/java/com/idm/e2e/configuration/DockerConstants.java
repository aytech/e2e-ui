package com.idm.e2e.configuration;

public class DockerConstants {
    public static final String CHROME_IMAGE = "selenium/node-chrome:3.141.59-vanadium";
    public static final String DOCKERFILE = "Dockerfile";
    public static final String DOCKERFILE_BASE = "Dockerfile-base";
    public static final String DOCKER_BASE_IMAGE = "e2e-base";
    public static final String DOCKER_CHROME_VOLUME = "/dev/shm";
    public static final String DOCKER_ENTRYPOINT = "entrypoint.sh";
    public static final String DOCKER_GRID_CONTAINER_PORT = "4444";
    public static final String DOCKER_NETWORK_NAME = "e2e-network";
    public static final String DOCKER_PATTERN_MESSAGE = ".*Scenario.*";
    public static final String DOCKER_PATTERN_MESSAGE_PASSED = ".*Scenario.*PASSED.*";
    public static final String DOCKER_PATTERN_MESSAGE_FAILED = ".*Scenario.*FAILED.*";
    public static final String DOCKER_PATTERN_MESSAGE_SKIPPED = ".*Scenario.*SKIPPED.*";
    public static final String DOCKER_UID = "LOCAL_USER_ID";
    public static final int DOCKER_UID_DEFAULT = 9001;
    public static final String DOCKER_WORK_DIRECTORY = "/home/gradle/app";
    public static final String DOCKER_REPORTS_PATH = "/app/build/reports";
    public static final String SELENIUM_GRID_CONTAINER_NAME = "selenium-hub";
    public static final String SELENIUM_GRID_IMAGE = "selenium/hub:3.141.59-vanadium";
}
