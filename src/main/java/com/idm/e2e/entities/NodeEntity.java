package com.idm.e2e.entities;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DOCKER_NODES")
public class NodeEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    @Column(name = "node")
    private String node;
    @Column(name = "status")
    protected String status;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "user_id")
    private UserEntity user;
    @OneToMany(mappedBy = "node",
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    private List<LogEntity> logs;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<LogEntity> getLogs() {
        return logs;
    }

    public void setLogs(List<LogEntity> logs) {
        this.logs = logs;
    }

    public void setLog(LogEntity log) {
        if (logs == null) {
            logs = new ArrayList<>();
        }
        logs.add(log);
        log.setNode(this);
    }

    @Override
    public String toString() {
        return "NodeEntity{" +
                "id=" + id +
                ", node='" + node + '\'' +
                ", status='" + status + '\'' +
                ", user=" + user +
                ", logs=" + logs +
                '}';
    }
}
