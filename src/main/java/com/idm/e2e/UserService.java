package com.idm.e2e;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserEntity createUser(UserEntity entity) {
        return repository.save(entity);
    }

    public UserEntity updateUser(UserEntity entity) {
        Optional<UserEntity> user = repository.findById(entity.getId());
        if (user.isPresent()) {
            UserEntity userEntity = user.get();
            userEntity.setEmail(entity.getEmail());
            userEntity.setPassword(entity.getPassword());
            return repository.save(userEntity);
        }
        return entity;
    }
}
