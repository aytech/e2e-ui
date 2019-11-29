package com.idm.e2e;

import com.idm.e2e.web.configuration.DockerCommands;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@SpringBootApplication
public class E2EApplication {

    public static void main(String[] args) {
        SpringApplication.run(E2EApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void applicationStartUp() {
        ProcessBuilder builder = DockerCommands.getRunningStatus();
        try {
            Process process = builder.start();
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = input.readLine()) != null) {
                // Response from Docker is 'true' or 'false'
                if (!Boolean.parseBoolean(line.replaceAll("'", ""))) {
                    dockerPrune();
                    dockerCreateNetwork();
                    startSeleniumGridContainer();
                } else {
                    System.out.println("Kill the setup");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void dockerPrune() {
        try {
            Process process = DockerCommands.prune().start();
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void dockerCreateNetwork() {
        try {
            Process process = DockerCommands.networkCreate().start();
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void startSeleniumGridContainer() {
        try {
            Process process = DockerCommands.startSeleniumGrid().start();
            process.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
