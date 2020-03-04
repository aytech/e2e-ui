package com.idm.e2e.entities;

import javax.persistence.*;

@Entity
@Table(name = "VARIABLE_DATA_TYPES")
public class VariableDataTypeEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "value")
    private String value;

    @OneToOne(mappedBy = "dataType")
    private SystemVariableEntity systemVariableEntity;

    @OneToOne(mappedBy = "dataType")
    private VariableEntity variableEntity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public SystemVariableEntity getSystemVariableEntity() {
        return systemVariableEntity;
    }

    public void setSystemVariableEntity(SystemVariableEntity systemVariableEntity) {
        this.systemVariableEntity = systemVariableEntity;
    }

    public VariableEntity getVariableEntity() {
        return variableEntity;
    }

    public void setVariableEntity(VariableEntity variableEntity) {
        this.variableEntity = variableEntity;
    }
}
