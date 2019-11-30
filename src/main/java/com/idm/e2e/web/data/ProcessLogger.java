package com.idm.e2e.web.data;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ProcessLogger {
    private Process process;

    public ProcessLogger(Process process) {
        this.process = process;
    }

    public void log() throws IOException {
        String line;
        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((line = input.readLine()) != null) {
            System.out.println("Input: " + line);
        }
        while ((line = error.readLine()) != null) {
            System.out.println("Error: " + line);
        }
    }

    public Boolean getLogBoolean() {
        try {
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
}
