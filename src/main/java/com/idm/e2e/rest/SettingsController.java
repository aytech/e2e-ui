package com.idm.e2e.rest;

import com.idm.e2e.entities.SystemVariableEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.SettingsResponse;
import com.idm.e2e.models.VariableResponse;
import com.idm.e2e.services.NodeService;
import com.idm.e2e.services.VariableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static com.idm.e2e.configuration.AppConstants.*;

@RestController
@RequestMapping(value = URI_API_BASE)
public class SettingsController {

    final VariableService variableService;
    final NodeService nodeService;

    public SettingsController(VariableService service, NodeService nodeService) {
        this.variableService = service;
        this.nodeService = nodeService;
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_VAR_CREATE)
    public ResponseEntity<VariableResponse> createVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariable(variableService.createVariable(user, entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_VAR_SYS_CREATE)
    public ResponseEntity<VariableResponse> createSystemVariable(Authentication authentication, @RequestBody SystemVariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        if (user.getRole().equals(UserEntity.Roles.ADMIN.toString())) {
            response.setVariable(variableService.createSystemVariable(entity));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(method = RequestMethod.PUT, value = URI_VAR_UPDATE)
    public ResponseEntity<VariableResponse> updateVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        try {
            response.setVariable(variableService.updateVariable(user, entity));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, value = URI_VAR_SYS_UPDATE)
    public ResponseEntity<VariableResponse> updateSystemVariable(Authentication authentication, @RequestBody SystemVariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        if (user.getRole().equals(UserEntity.Roles.ADMIN.toString())) {
            response.setVariable(variableService.updateSystemVariable(entity));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_VAR_REMOVE)
    public ResponseEntity<VariableResponse> removeVariable(@RequestBody VariableEntity entity) {
        variableService.removeVariable(entity);
        return new ResponseEntity<>(null, HttpStatus.GONE);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_VAR_SYS_REMOVE)
    public ResponseEntity<VariableResponse> removeSystemVariable(Authentication authentication, @RequestBody SystemVariableEntity entity) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        if (user.getRole().equals(UserEntity.Roles.ADMIN.toString())) {
            variableService.removeSystemVariable(entity);
            return new ResponseEntity<>(null, HttpStatus.GONE);
        } else {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_SETTINGS)
    public ResponseEntity<SettingsResponse> getSettings(Authentication authentication) {
        SettingsResponse response = new SettingsResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariables(variableService.getCustomVariables(user));
        response.setSystemVariables(variableService.getSystemVariables());
        response.setNodes(nodeService.getNodes(user));
        response.setSystem(user.getRole().equals(UserEntity.Roles.ADMIN.toString()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
