package com.idm.e2e.rest;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.SettingsResponse;
import com.idm.e2e.models.VariableResponse;
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

    final VariableService service;

    public SettingsController(VariableService service) {
        this.service = service;
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_VAR_CREATE)
    public ResponseEntity<VariableResponse> createVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariable(service.createVariable(user, entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, value = URI_VAR_UPDATE)
    public ResponseEntity<VariableResponse> updateVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        try {
            response.setVariable(service.updateVariable(user, entity));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_VAR_REMOVE)
    public ResponseEntity<VariableResponse> removeVariable(@RequestBody VariableEntity entity) {
        service.removeVariable(entity);
        return new ResponseEntity<>(null, HttpStatus.GONE);
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_SETTINGS)
    public ResponseEntity<SettingsResponse> getSettings(Authentication authentication) {
        SettingsResponse response = new SettingsResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariables(service.getCustomVariables(user));
        response.setSystemVariables(service.getSystemVariables());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
