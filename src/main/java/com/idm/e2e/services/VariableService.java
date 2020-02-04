package com.idm.e2e.services;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.BasicVariable;
import com.idm.e2e.repositories.VariableRepository;
import org.springframework.stereotype.Service;

@Service
public class VariableService {

    private final VariableRepository repository;

    public VariableService(VariableRepository repository) {
        this.repository = repository;
    }

    private BasicVariable basicVariable(VariableEntity entity) {
        BasicVariable variable = new BasicVariable();
        variable.setKey(entity.getKey());
        variable.setValue(entity.getValue());
        return variable;
    }

    public BasicVariable createVariable(UserEntity userEntity, VariableEntity entity) {
        entity.setUser(userEntity);
        return basicVariable(repository.save(entity));
    }
}
