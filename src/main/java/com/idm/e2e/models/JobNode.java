package com.idm.e2e.models;

import java.util.Date;
import java.util.List;

@SuppressWarnings("unused")
public class JobNode {
    private long id;
    private String tag;
    private String status;
    private Boolean stoppable;
    private Date created;
    private List<BasicLog> logs;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getStoppable() {
        return stoppable;
    }

    public void setStoppable(Boolean stoppable) {
        this.stoppable = stoppable;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public List<BasicLog> getLogs() {
        return logs;
    }

    public void setLogs(List<BasicLog> logs) {
        this.logs = logs;
    }

    @Override
    public String toString() {
        return "JobNode{" +
                "id=" + id +
                ", tag='" + tag + '\'' +
                ", status='" + status + '\'' +
                ", created=" + created +
                ", logs=" + logs +
                '}';
    }
}
