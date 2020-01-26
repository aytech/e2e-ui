package com.idm.e2e.services;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.repositories.UserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository) {
        userRepository = repository;
        passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserEntity createUser(UserEntity entity) {
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        entity.setRole("USER");
        entity.setActivationCode(RandomStringUtils.random(10, true, true));
        return userRepository.save(entity);
    }

    public UserEntity activateUser(UserEntity entity) {
        UserEntity user = userRepository.findByCode(entity.getActivationCode());
        if (user != null) {
            user.setActivationCode(null);
            user.setEnabled(true);
            return userRepository.save(user);
        }
        return entity;
    }

    public UserEntity findByEmail(UserEntity entity) {
        return userRepository.findByEmail(entity.getEmail());
    }

    public UserEntity findByCode(UserEntity entity) {
        return userRepository.findByCode(entity.getActivationCode());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findActiveUser(username, true, false);
    }
}
