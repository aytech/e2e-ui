package com.idm.e2e.web.processes;

import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;

import java.util.ArrayList;

public class DockerRunner extends Thread {
    private static DockerRunner instance;
    private ArrayList<DockerRunnable> runnableList;

    public static DockerRunner getInstance() {
        if (instance == null) {
            instance = new DockerRunner();
            instance.start();
        }
        return instance;
    }

    private DockerRunner() {
        runnableList = new ArrayList<>();
    }

    public void run(ArrayList<DockerRunnable> runnableList) {
        if (this.runnableList.size() > 0) {
            throw new IllegalStateException("Process already running");
        }
        this.runnableList = runnableList;
    }

    public void run() {
        waitForRunnable();
        for (DockerRunnable runnable : runnableList) {
            runnable.run();
            waitForRunnableProcess(runnable);
            runnable.destroy();
        }
        cleanup();
    }

    private void cleanup() {
        StatusStorage.getCurrentStatus().setRunning(false);
        StatusStorage.setPreviousStatus(StatusStorage.getCurrentStatus());
        StatusStorage.setCurrentStatus(null);
        runnableList = null;
        instance = null;
    }

    private void waitForRunnable() {
        while (runnableList.size() < 1) {
            try {
                sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void waitForRunnableProcess(DockerRunnable runnable) {
        while ((runnable.getProcess() == null || runnable.getProcess().isAlive()) && !runnable.isFailed()) {
            try {
                sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
