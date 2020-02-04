package com.idm.e2e.services;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.BasicVariable;
import com.idm.e2e.repositories.VariableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VariableService {

    private final VariableRepository repository;

    public VariableService(VariableRepository repository) {
        this.repository = repository;
    }

    private BasicVariable basicVariable(VariableEntity entity) {
        BasicVariable variable = new BasicVariable();
        variable.setId(entity.getId());
        variable.setKey(entity.getKey());
        variable.setValue(entity.getValue());
        return variable;
    }

    public BasicVariable createVariable(UserEntity user, VariableEntity variable) {
        variable.setUser(user);
        return basicVariable(repository.save(variable));
    }

    public Integer removeVariable(UserEntity user, VariableEntity variable) {
        variable.setUser(user);
        return repository.removeById(variable.getId(), user.getId());
    }

    public List<BasicVariable> getBasicVariables(UserEntity userEntity) {
        List<BasicVariable> variables = new ArrayList<>();
        for (VariableEntity variable : repository.findAllByUser(userEntity.getId())) {
            variables.add(basicVariable(variable));
        }
        return variables;
    }

    public List<VariableEntity> getVariables(UserEntity userEntity) {
        return repository.findAllByUser(userEntity.getId());
    }
}
