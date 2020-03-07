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

import java.util.*;

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

    public BasicVariable createSystemVariable(SystemVariableEntity variable) {
        Optional<SystemVariableEntity> variableEntity = systemVariableRepository.findByKey(variable.getKey());
        if (!variableEntity.isPresent()) {
            return basicVariable(systemVariableRepository.save(variable));
        }
        return basicVariable(variable);
    }

    public void removeVariable(VariableEntity variable) {
        Optional<VariableEntity> variableEntity = variableRepository.findById(variable.getId());
        variableEntity.ifPresent(variableRepository::delete);
    }

    public void removeSystemVariable(SystemVariableEntity variable) {
        Optional<SystemVariableEntity> variableEntity = systemVariableRepository.findById(variable.getId());
        variableEntity.ifPresent(systemVariableRepository::delete);
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

    public BasicVariable updateSystemVariable(SystemVariableEntity variable) {
        Optional<SystemVariableEntity> variableEntity = systemVariableRepository.findById(variable.getId());
        if (variableEntity.isPresent()) {
            SystemVariableEntity newVariable = variableEntity.get();
            newVariable.setKey(variable.getKey());
            newVariable.setValue(variable.getValue());
            return basicVariable(systemVariableRepository.save(newVariable));
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

    private List<BasicVariable> addDefaultSystemVariables() {
        List<BasicVariable> collection = new ArrayList<>();

        BasicVariable host = new BasicVariable();
        host.setKey(BasicVariable.DefaultVariableName.E2E_ENVIRONMENT.toString());
        host.setValue("staging");
        host.setType(BasicVariable.VariableType.TEXT);

        BasicVariable documentType = new BasicVariable();
        documentType.setKey(BasicVariable.DefaultVariableName.E2E_DOCUMENT_TYPE.toString());
        documentType.setValue("AA");
        documentType.setType(BasicVariable.VariableType.TEXT);

        BasicVariable filePath = new BasicVariable();
        filePath.setKey(BasicVariable.DefaultVariableName.E2E_FILE_PATH.toString());
        filePath.setValue("/home/gradle/app/1.jpg");
        filePath.setType(BasicVariable.VariableType.TEXT);

        BasicVariable user = new BasicVariable();
        user.setKey(BasicVariable.DefaultVariableName.E2E_USER.toString());
        user.setValue("oleg.yapparov@infor.com");
        user.setType(BasicVariable.VariableType.EMAIL);

        BasicVariable password = new BasicVariable();
        password.setKey(BasicVariable.DefaultVariableName.E2E_PASSWORD.toString());
        password.setValue("dummy");
        password.setType(BasicVariable.VariableType.PASSWORD);

        return collection;
    }
}
