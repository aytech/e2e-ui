package com.idm.e2e.models;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table
public class User {

    public User(String email, String password) {
        this.email = email;
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        this.password = encoder.encode(password);
    }

    public User() {
    }

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String activationCode;
    @Column
    private String session;
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    @Column
    private Date created;
    @Column
    private boolean live;
    @Column
    private boolean deleted;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", activationCode='" + activationCode + '\'' +
                ", session='" + session + '\'' +
                ", created=" + created +
                ", live=" + live +
                ", deleted=" + deleted +
                '}';
    }
}
