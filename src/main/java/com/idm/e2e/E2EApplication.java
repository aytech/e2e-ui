package com.idm.e2e;

import com.idm.e2e.web.processes.DockerUtility;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_GRID_CONTAINER_NAME;

@SpringBootApplication
public class E2EApplication {

    public static void main(String[] args) {
        SpringApplication.run(E2EApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void applicationStartUp() {
        DockerUtility utility = new DockerUtility(DOCKER_GRID_CONTAINER_NAME);
        utility.startSeleniumGridContainer();
    }
}
