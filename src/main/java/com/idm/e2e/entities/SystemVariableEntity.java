package com.idm.e2e.entities;

import javax.persistence.*;

@Entity
@Table(name = "SYSTEM_VARIABLES")
public class SystemVariableEntity implements VariablesEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column
    private String key;
    @Column
    private String value;

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
