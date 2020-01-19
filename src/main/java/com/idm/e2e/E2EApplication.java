package com.idm.e2e;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class E2EApplication {

    public static void main(String[] args) {
        SpringApplication.run(E2EApplication.class, args);
    }

    // https://www.baeldung.com/spring-boot-h2-database
//    @EventListener(ApplicationReadyEvent.class)
//    public void applicationStartUp() {
//        DockerUtility utility = new DockerUtility(null);
//        utility.startSeleniumGridContainer();
//    }
}
