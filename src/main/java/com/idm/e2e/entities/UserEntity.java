package com.idm.e2e.entities;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import java.util.Date;
// https://howtodoinjava.com/spring-boot2/spring-boot-crud-hibernate/
@Entity
@Table(name = "USERS")
public class UserEntity {

    public UserEntity(String email, String password) {
        this.email = email;
        setPassword(password);
    }

    public UserEntity() {
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        this.password = encoder.encode(password);
    }

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
