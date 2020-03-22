package com.idm.e2e.entities;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "SYSTEM_LOGS")
public class SystemLogEntity implements LogEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;

    @Column(name = "level",
            length = 10,
            nullable = false)
    private String level;

    @Column(name = "category",
            length = 10,
            nullable = false)
    private String category;

    @Column(name = "log")
    @Lob
    private String log;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created")
    private Date created;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    @Override
    public String toString() {
        return "SystemLogEntity{" +
                "id=" + id +
                ", level='" + level + '\'' +
                ", category='" + category + '\'' +
                ", log='" + log + '\'' +
                ", created=" + created +
                '}';
    }
}
