package com.idm.e2e;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.ProcessLogger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.io.IOException;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_GRID_CONTAINER_NAME;

@SpringBootApplication
public class E2EApplication {

    public static void main(String[] args) {
        SpringApplication.run(E2EApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void applicationStartUp() {
        try {
            Process process = DockerCommands.getRunningStatus().start();
            ProcessLogger logger = new ProcessLogger(process);
            if (!logger.getLogBoolean()) {
                dockerPrune();
                dockerCreateNetwork();
                startSeleniumGridContainer();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void dockerPrune() {
        try {
            Process process = DockerCommands.prune().start();
            ProcessLogger logger = new ProcessLogger(process);
            logger.log(null);
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void dockerCreateNetwork() {
        try {
            Process process = DockerCommands.networkCreate().start();
            ProcessLogger logger = new ProcessLogger(process);
            logger.log(null);
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void startSeleniumGridContainer() {
        try {
            String nodeID = DOCKER_GRID_CONTAINER_NAME;
            Process process = DockerCommands.startSeleniumGrid(nodeID).start();
            ProcessLogger logger = new ProcessLogger(process);
            logger.log(nodeID);
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
