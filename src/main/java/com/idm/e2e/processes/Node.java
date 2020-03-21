package com.idm.e2e.processes;

import com.idm.e2e.entities.*;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.resources.DockerCommandsResource;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.idm.e2e.configuration.DockerConstants.*;

public abstract class Node implements DockerRunnable {

    private enum LogLevel {
        INFO,
        DEBUG
    }

    private enum Category {
        ERROR,
        FAILED,
        INFO,
        OTHER,
        PASSED,
        SKIPPED
    }

    private enum NodeStatus {
        COMPLETE("complete"),
        IN_PROGRESS("in progress");

        private final String status;

        NodeStatus(String status) {
            this.status = status;
        }

        public String getStatus() {
            return status;
        }
    }

    protected static SessionFactory sessionFactory;

    protected static Session getSession() {
        if (sessionFactory == null) {
            sessionFactory = new Configuration()
                    .configure("hibernate.cfg.xml")
                    .addAnnotatedClass(NodeEntity.class)
                    .addAnnotatedClass(UserEntity.class)
                    .addAnnotatedClass(NodeLogEntity.class)
                    .addAnnotatedClass(SystemLogEntity.class)
                    .addAnnotatedClass(VariableEntity.class)
                    .buildSessionFactory();
        }
        return sessionFactory.openSession();
    }

    protected NodeEntity addNode(UserEntity userEntity, String tag) {
        NodeEntity nodeEntity = new NodeEntity();
        nodeEntity.setNode(tag);
        nodeEntity.setStatus(NodeStatus.IN_PROGRESS.getStatus());
        nodeEntity.setUser(userEntity);
        Session session = getSession();
        session.beginTransaction();
        session.save(nodeEntity);
        session.getTransaction().commit();
        session.close();
        return nodeEntity;
    }

    protected void closeNode(NodeEntity nodeEntity) {
        nodeEntity.setStatus(NodeStatus.COMPLETE.getStatus());
        Session session = getSession();
        session.beginTransaction();
        session.update(nodeEntity);
        session.getTransaction().commit();
        session.close();
    }

    public void log(Process process, NodeEntity node) throws IOException {
        String logLine;
        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((logLine = input.readLine()) != null) {
            saveLog(logLine, node);
        }
        while ((logLine = error.readLine()) != null) {
            saveLog(logLine, node);
        }
    }

    protected void logSystem(Process process) throws IOException {
        String line;
        BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader error = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        while ((line = input.readLine()) != null) {
            saveSystemLog(Category.INFO, line);
        }
        while ((line = error.readLine()) != null) {
            saveSystemLog(Category.ERROR, line);
        }
    }

    private void saveLog(String log, NodeEntity node) {
        NodeLogEntity logEntity = new NodeLogEntity();
        logEntity.setLevel(getLogLevel(log).toString());
        logEntity.setCategory(getLogCategory(log).toString());
        logEntity.setLog(log);
        logEntity.setNode(node);
        persistLog(logEntity);
    }

    private void saveSystemLog(Category category, String log) {
        SystemLogEntity logEntity = new SystemLogEntity();
        logEntity.setLevel(LogLevel.DEBUG.toString());
        logEntity.setCategory(category.toString());
        logEntity.setLog(log);
        persistLog(logEntity);
    }

    private void persistLog(LogEntity entity) {
        Session session = getSession();
        session.beginTransaction();
        session.save(entity);
        session.getTransaction().commit();
        session.close();
    }

    private Category getLogCategory(String logMessage) {
        Pattern messagesPassedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_PASSED);
        Matcher messagesPassedMatcher = messagesPassedPattern.matcher(logMessage);
        if (messagesPassedMatcher.matches()) {
            return Category.PASSED;
        }

        Pattern messagesFailedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_FAILED);
        Matcher messagesFailedMatcher = messagesFailedPattern.matcher(logMessage);
        if (messagesFailedMatcher.matches()) {
            return Category.FAILED;
        }

        Pattern messagesSkippedPattern = Pattern.compile(DOCKER_PATTERN_MESSAGE_SKIPPED);
        Matcher messagesSkippedMatcher = messagesSkippedPattern.matcher(logMessage);
        if (messagesSkippedMatcher.matches()) {
            return Category.SKIPPED;
        }

        return Category.OTHER;
    }

    private LogLevel getLogLevel(String logMessage) {
        Pattern pattern = Pattern.compile(DOCKER_PATTERN_MESSAGE);
        Matcher matcher = pattern.matcher(logMessage);
        if (matcher.matches()) {
            return LogLevel.INFO;
        }
        return LogLevel.DEBUG;
    }

    protected boolean imageExists(String imageTag) throws IOException {
        Process imageProcess = DockerCommandsResource.getImageListProcess(imageTag).start();
        ProcessLogger logger = new ProcessLogger(imageProcess);
        return logger.getLogString() != null;
    }
}
