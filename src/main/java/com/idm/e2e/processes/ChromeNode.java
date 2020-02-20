package com.idm.e2e.processes;

import com.idm.e2e.entities.*;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.repositories.UserRepository;
import com.idm.e2e.resources.DockerCommandsResource;
import com.idm.e2e.services.NodeService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Transactional
public class ChromeNode extends Node {

    private Process chromeProcess;
    private UserEntity userEntity;
    private NodeEntity nodeEntity;
    protected String nodeID;
    private Boolean isFailed;

    public ChromeNode(UserEntity userEntity) {
        isFailed = false;
        nodeID = String.format("chrome_%s", DockerCommandsResource.getNewNodeID());
        this.userEntity = userEntity;
        nodeEntity = addNode(userEntity, nodeID);
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        System.out.println("CHROME alive: " + (chromeProcess != null && chromeProcess.isAlive()));
        return chromeProcess != null && chromeProcess.isAlive();
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        if (chromeProcess != null) {
            chromeProcess.destroy();
        }
        closeNode(nodeEntity);
    }

    @Override
    public void run() {
        try {
            System.out.println("Start Chrome");
//            String nodeTag = String.format("chrome_%s", nodeID);
//            nodeEntity = addNode(userEntity, nodeTag);
            for (int i = 0; i < 5; i++) {
                debug(nodeEntity, "Debug " + i);
                info(nodeEntity, "Warn " + i);
            }

            chromeProcess = DockerCommandsResource.runChromeNode(nodeID).start();
            log(chromeProcess, nodeID);
//            ProcessLogger chromeLogger = new ProcessLogger(chromeProcess);
//            chromeLogger.log(nodeID);
            chromeProcess.waitFor();
            System.out.println("End Chrome");
        } catch (IOException | InterruptedException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }




}
