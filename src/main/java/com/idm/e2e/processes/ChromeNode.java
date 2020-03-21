package com.idm.e2e.processes;

import com.idm.e2e.models.EmailRequest;
import com.idm.e2e.resources.EmailResource;
import com.idm.e2e.resources.FilesResource;
import com.idm.e2e.entities.*;
import com.idm.e2e.resources.DockerCommandsResource;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;

import static com.idm.e2e.configuration.AppConstants.*;
import static com.idm.e2e.configuration.DockerConstants.*;

@Transactional
public class ChromeNode extends Node {

    private Process process;
    private Process chromeProcess;
    private Process e2eProcess;
    private NodeEntity nodeEntity;
    protected String nodeId;
    private String e2eNodeTag;
    private DockerCommandsResource dockerCommands;
    private FilesResource filesResource;
    private Boolean isFailed;
    private Boolean isAlive;
    private HashMap<String, String> variables;

    public ChromeNode(
            UserEntity user,
            List<SystemVariableEntity> systemVariables,
            List<VariableEntity> userVariables) {
        isAlive = true;
        isFailed = false;
        dockerCommands = new DockerCommandsResource();
        nodeId = String.format("chrome_%s", dockerCommands.getNewNodeID());
        e2eNodeTag = String.format("%s%s", nodeId, NODE_E2E_SUFFIX);
        filesResource = new FilesResource(nodeId);
        nodeEntity = addNode(user, nodeId);
        variables = new HashMap<>();
        for (SystemVariableEntity systemVariable : systemVariables) {
            variables.put(systemVariable.getKey(), systemVariable.getValue());
        }
        for (VariableEntity userVariable : userVariables) {
            variables.put(userVariable.getKey(), userVariable.getValue());
        }
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        return isAlive;
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        try {
            Process stopChromeProcess = dockerCommands.getStopContainerCommand(nodeId).start();
            stopChromeProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (process != null) {
                process.destroy();
            }
            if (chromeProcess != null) {
                chromeProcess.destroy();
            }
            if (e2eProcess != null) {
                e2eProcess.destroy();
            }
            closeNode(nodeEntity);
        }
    }

    @Override
    public void run() {
        try {
            if (!imageExists(DOCKER_BASE_IMAGE)) {
                filesResource.writeBaseDockerFile();
                buildBaseDockerImage();
            }
            if (!imageExists(e2eNodeTag)) {
                filesResource.writeDockerFile(E2E_URL, E2E_REPO_BRANCH);
                buildDockerImage();
            }
            runChromeNode();
            runE2eNode();
            // sendEmail();
            isAlive = false;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            isFailed = true;
            isAlive = false;
        }
    }

    private void buildBaseDockerImage() throws IOException, InterruptedException {
        File dockerFile = filesResource.getFileFromNodeDirectory(DOCKERFILE_BASE);
        process = dockerCommands
                .buildImage(dockerFile.getAbsolutePath(), DOCKER_BASE_IMAGE, dockerFile.getParent())
                .start();
        log(process, nodeEntity);
        process.waitFor();
    }

    private void buildDockerImage() throws IOException, InterruptedException {
        filesResource.copyRsaFile();
        File dockerFile = filesResource.getFileFromNodeDirectory(DOCKERFILE);
        process = dockerCommands
                .buildImage(dockerFile.getAbsolutePath(), e2eNodeTag, dockerFile.getParent())
                .start();
        log(process, nodeEntity);
        process.waitFor();
    }

    private void runChromeNode() throws IOException, InterruptedException {
        ProcessBuilder builder = dockerCommands.runChromeNode(nodeId);
        chromeProcess = builder.start();
        log(chromeProcess, nodeEntity);
        chromeProcess.waitFor();
    }

    private void runE2eNode() throws IOException, InterruptedException {
        String reportsDirectory = filesResource.getNodeDirectory().getPath();
        ProcessBuilder builder = dockerCommands.runE2ENode(e2eNodeTag, reportsDirectory, variables);
        e2eProcess = builder.start();
        log(e2eProcess, nodeEntity);
        e2eProcess.waitFor();
    }

    private void sendEmail() {
//        EmailRequest email = new EmailRequest();
//        email.setNodeID(configuration.getNodeID());
//        email.setHost(configuration.getRequestHost());
//        email.setRecipient(configuration.getUser());
//        email.generateReportDownloadedMessage();
//        EmailResource emailResource = new EmailResource();
//        try {
//            emailResource.sendGmail(email);
//        } catch (IOException | MessagingException | GeneralSecurityException e) {
//            status.addStdInputEntry("Error sending email: " + e.getMessage());
//            e.printStackTrace();
//        }
    }
}
