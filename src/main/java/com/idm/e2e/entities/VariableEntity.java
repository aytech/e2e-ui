package com.idm.e2e.entities;

import javax.persistence.*;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "VARIABLES")
public class VariableEntity {
    @Id
    @Column
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USERS")
    private UserEntity user;

    @Column
    private String key;

    @Column
    private String value;
}
