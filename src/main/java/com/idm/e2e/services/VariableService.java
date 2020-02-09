package com.idm.e2e.services;

import com.idm.e2e.entities.SystemVariableEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.entities.VariablesEntity;
import com.idm.e2e.models.BasicVariable;
import com.idm.e2e.repositories.SystemVariableRepository;
import com.idm.e2e.repositories.VariableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VariableService {

    private final VariableRepository repository;
    private final SystemVariableRepository sRepository;

    public VariableService(VariableRepository repository, SystemVariableRepository sRepository) {
        this.repository = repository;
        this.sRepository = sRepository;
    }

    private BasicVariable basicVariable(VariablesEntity entity) {
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

    public BasicVariable updateVariable(UserEntity user, VariableEntity variable) throws Exception {
        VariableEntity entity = repository.findByIdAndUser(user.getId(), variable.getId());
        if (entity != null) {
            Integer saveSuccess = repository.updateVariable(variable.getKey(), variable.getValue(), variable.getId());
            if (saveSuccess != 1) {
                throw new Exception("Could not save variable with ID " + variable.getId());
            }
        }
        return basicVariable(variable);
    }

    public List<BasicVariable> getCustomVariables(UserEntity userEntity) {
        List<BasicVariable> variables = new ArrayList<>();
        for (VariableEntity variable : repository.findAllByUser(userEntity.getId())) {
            variables.add(basicVariable(variable));
        }
        return variables;
    }

    public List<BasicVariable> getSystemVariables() {
        List<BasicVariable> variables = new ArrayList<>();
        for (SystemVariableEntity variable : sRepository.findAll()) {
            variables.add(basicVariable(variable));
        }
        return variables;
    }
}
