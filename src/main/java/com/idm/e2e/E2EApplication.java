package com.idm.e2e;

import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.processes.SeleniumGrid;
import com.idm.e2e.processes.ThreadRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.util.ArrayList;

@SpringBootApplication
public class E2EApplication {

    public static void main(String[] args) {
        SpringApplication.run(E2EApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void applicationStartUp() {
        ArrayList<DockerRunnable> jobs = new ArrayList<>();
        jobs.add(new SeleniumGrid());
        new ThreadRunner(jobs, "test").start();
    }
}
