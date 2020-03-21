package com.idm.e2e.services;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;

import static com.idm.e2e.configuration.AppConstants.NODE_E2E_SUFFIX;

@Service
public class DockerService {
    public boolean getNodeRunningStatus(String nodeId) {
        ArrayList<String> arguments = new ArrayList<>();
        arguments.add("docker");
        arguments.add("inspect");
        arguments.add("-f");
        arguments.add("'{{.State.Running}}'");
        arguments.add(nodeId);
        ProcessBuilder builder = new ProcessBuilder().command(arguments);
        try {
            Process process = builder.start();
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = input.readLine()) != null) {
                if (Boolean.parseBoolean(line.replaceAll("'", ""))) {
                    return true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void stopNodeContainer(String nodeId) {
        ArrayList<String> arguments = new ArrayList<>();
        arguments.add("docker");
        arguments.add("stop");
        arguments.add(nodeId);
        try {
            new ProcessBuilder().command(arguments).start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void removeNodeImage(String imageName) {
        ArrayList<String> arguments = new ArrayList<>();
        arguments.add("docker");
        arguments.add("image");
        arguments.add("rm");
        arguments.add(String.format("%s%s", imageName, NODE_E2E_SUFFIX));
        try {
            new ProcessBuilder().command(arguments).start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
