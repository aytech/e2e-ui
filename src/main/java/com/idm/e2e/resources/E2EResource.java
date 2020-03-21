package com.idm.e2e.resources;

import com.idm.e2e.loggers.ProcessLogger;

import java.io.IOException;

abstract class E2EResource {
    protected String getUserUid() {
        try {
            Process process = Runtime.getRuntime().exec("id -u");
            ProcessLogger logger = new ProcessLogger(process);
            String uid = logger.getLogString();
            process.destroy();
            return uid;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
