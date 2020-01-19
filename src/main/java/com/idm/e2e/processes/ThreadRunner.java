package com.idm.e2e.processes;

import com.idm.e2e.data.StatusStorage;
import com.idm.e2e.interfaces.DockerRunnable;

import java.util.ArrayList;

public class ThreadRunner extends Thread {
    private ArrayList<DockerRunnable> runnableList;
    private String nodeID;

    public ThreadRunner(ArrayList<DockerRunnable> runnableList, String nodeID) {
        this.runnableList = runnableList;
        this.nodeID = nodeID;
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
            StatusStorage.getStatus(nodeID).setRunning(true);
            runnable.run();
            waitForRunnableProcess(runnable);
            runnable.destroy();
        }
        cleanup();
    }

    private void cleanup() {
        StatusStorage.getStatus(nodeID).setRunning(false);
        runnableList = null;
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
        while (runnable.isAlive() && !runnable.isFailed()) {
            try {
                sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
