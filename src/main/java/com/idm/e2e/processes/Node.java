package com.idm.e2e.processes;

import com.idm.e2e.entities.NodeLogEntity;
import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.interfaces.DockerRunnable;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public abstract class Node implements DockerRunnable {

    private enum LogLevel {
        INFO,
        DEBUG
    }

    private enum Categories {
        FAILED,
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

    private static Session getSession() {
        SessionFactory sessionFactory = new Configuration()
                .configure("hibernate.cfg.xml")
                .addAnnotatedClass(NodeEntity.class)
                .addAnnotatedClass(UserEntity.class)
                .addAnnotatedClass(NodeLogEntity.class)
                .addAnnotatedClass(VariableEntity.class)
                .buildSessionFactory();
        return sessionFactory.getCurrentSession();
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
        return nodeEntity;
    }

    protected void closeNode(NodeEntity nodeEntity) {
        nodeEntity.setStatus(NodeStatus.COMPLETE.getStatus());
        Session session = getSession();
        session.beginTransaction();
        session.update(nodeEntity);
        session.getTransaction().commit();
    }

    private void saveLog(NodeEntity nodeEntity, String log, LogLevel logLevel) {
        NodeLogEntity logEntity = new NodeLogEntity();
        logEntity.setLevel(logLevel.toString());
        // Figure out how to set category, maybe in log method
        logEntity.setLog(log);
        logEntity.setNode(nodeEntity);
        Session session = getSession();
        session.beginTransaction();
        session.save(logEntity);
        session.getTransaction().commit();
    }

    protected void debug(NodeEntity nodeEntity, String log) {
        saveLog(nodeEntity, log, LogLevel.DEBUG);
    }

    protected void info(NodeEntity nodeEntity, String log) {
        saveLog(nodeEntity, log, LogLevel.INFO);
    }

    public void log(Process process, String nodeID) throws IOException {
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
}
