package com.idm.e2e.rest;

import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.models.BasicVariable;
import com.idm.e2e.services.VariableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static com.idm.e2e.configuration.AppConstants.URI_API_BASE;
import static com.idm.e2e.configuration.AppConstants.URI_VAR_CREATE;

@RestController
@RequestMapping(value = URI_API_BASE)
public class SettingsController {

    final VariableService service;

    public SettingsController(VariableService service) {
        this.service = service;
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_VAR_CREATE)
    public ResponseEntity<BasicVariable> createVariable(Authentication authentication, @RequestBody VariableEntity entity) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        return new ResponseEntity<>(service.createVariable(user, entity), HttpStatus.OK);
    }
}
