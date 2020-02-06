package com.idm.e2e.rest;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.BasicVariable;
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

import java.util.ArrayList;
import java.util.List;

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

    @RequestMapping(method = RequestMethod.POST, value = URI_VAR_UPDATE)
    public ResponseEntity<VariableResponse> updateVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariable(service.updateVariable(user, entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_VAR_REMOVE)
    public ResponseEntity<VariableResponse> removeVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        VariableResponse response = new VariableResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setStatus(service.removeVariable(user, entity));
        if (response.getStatus() == 1) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        if (response.getStatus() == 0) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_SETTINGS)
    public ResponseEntity<SettingsResponse> getSettings(Authentication authentication) {
        SettingsResponse response = new SettingsResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        response.setVariables(service.getBasicVariables(user));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
