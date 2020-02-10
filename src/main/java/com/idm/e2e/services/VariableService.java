package com.idm.e2e.services;

import com.idm.e2e.entities.SystemVariableEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.entities.VariablesEntity;
import com.idm.e2e.models.BasicVariable;
import com.idm.e2e.repositories.SystemVariableRepository;
import com.idm.e2e.repositories.UserRepository;
import com.idm.e2e.repositories.VariableRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VariableService {

    private final VariableRepository variableRepository;
    private final SystemVariableRepository systemVariableRepository;
    private final UserRepository userRepository;

    public VariableService(
            VariableRepository variableRepository,
            SystemVariableRepository systemVariableRepository,
            UserRepository userRepository) {
        this.variableRepository = variableRepository;
        this.systemVariableRepository = systemVariableRepository;
        this.userRepository = userRepository;
    }

    private BasicVariable basicVariable(VariablesEntity entity) {
        BasicVariable variable = new BasicVariable();
        variable.setId(entity.getId());
        variable.setKey(entity.getKey());
        variable.setValue(entity.getValue());
        return variable;
    }

    public BasicVariable createVariable(UserEntity user, VariableEntity variable) {
        Optional<UserEntity> userEntity = userRepository.findById(user.getId());
        if (userEntity.isPresent()) {
            userEntity.get().addVariable(variable);
            return basicVariable(variableRepository.save(variable));
        }
        return basicVariable(variable);
    }

    public void removeVariable(VariableEntity variable) {
        Optional<VariableEntity> variableEntity = variableRepository.findById(variable.getId());
        variableEntity.ifPresent(variableRepository::delete);
    }

    public BasicVariable updateVariable(UserEntity user, VariableEntity variable) throws Exception {
        VariableEntity entity = variableRepository.findByIdAndUser(user.getId(), variable.getId());
        if (entity != null) {
            Integer saveSuccess = variableRepository.updateVariable(variable.getKey(), variable.getValue(), variable.getId());
            if (saveSuccess != 1) {
                throw new Exception("Could not save variable with ID " + variable.getId());
            }
        }
        return basicVariable(variable);
    }

    public List<BasicVariable> getCustomVariables(UserEntity user) {
        Optional<UserEntity> userEntity = userRepository.findById(user.getId());
        List<BasicVariable> variables = new ArrayList<>();
        if (userEntity.isPresent()) {
            for (VariableEntity variableEntity : userEntity.get().getVariables()) {
                variables.add(basicVariable(variableEntity));
            }
        }
        return variables;
    }

    public List<BasicVariable> getSystemVariables() {
        List<BasicVariable> variables = new ArrayList<>();
        for (SystemVariableEntity variable : systemVariableRepository.findAll()) {
            variables.add(basicVariable(variable));
        }
        return variables;
    }
}
