package com.idm.e2e.services;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.models.BasicUser;
import com.idm.e2e.repositories.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.idm.e2e.configuration.AppConstants.ROLE_USER;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository) {
        userRepository = repository;
        passwordEncoder = new BCryptPasswordEncoder();
    }

    private BasicUser basicUser(UserEntity entity) {
        BasicUser user = new BasicUser();
        user.setEmail(entity.getEmail());
        user.setEnabled(entity.isEnabled());
        user.setCreated(entity.getCreated());
        user.setDeleted(entity.isDeleted());
        return user;
    }

    public BasicUser createUser(UserEntity entity) {
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        entity.setRole(ROLE_USER);
        return basicUser(userRepository.save(entity));
    }

    public BasicUser updateUser(UserEntity entity) {
        return basicUser(userRepository.save(entity));
    }

    public BasicUser activateUser(UserEntity entity) {
        UserEntity user = userRepository.findByCode(entity.getActivationCode());
        if (user != null) {
            user.setActivationCode(null);
            user.setEnabled(true);
            return basicUser(userRepository.save(user));
        }
        return null;
    }

    public BasicUser resetUserActivationCode(UserEntity entity) {
        UserEntity user = findActiveUser(entity.getEmail());
        if (user != null) {
            user.setActivationCode(getNewActivationCode());
            return basicUser(userRepository.save(user));
        }
        return null;
    }

    public BasicUser updateUserPassword(UserEntity entity) {
        UserEntity user = findByCode(entity.getActivationCode());
        if (user != null) {
            user.setPassword(passwordEncoder.encode(entity.getPassword()));
            return basicUser(userRepository.save(user));
        }
        return null;
    }

    public String getNewActivationCode() {
        return RandomStringUtils.random(10, true, true);
    }

    public UserEntity findByEmail(UserEntity entity) {
        return userRepository.findByEmail(entity.getEmail());
    }

    public UserEntity findByCode(String code) {
        return userRepository.findByCode(code);
    }

    public UserEntity findActiveUser(String email) {
        return userRepository.findActiveUser(email, true, false);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return findActiveUser(username);
    }
}