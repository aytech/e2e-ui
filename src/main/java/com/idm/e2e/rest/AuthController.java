package com.idm.e2e.rest;

import com.idm.e2e.services.UserService;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.models.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.POST, value = "/register")
    public ResponseEntity<AuthResponse> signUp(HttpServletRequest request, @RequestBody UserEntity entity) {
        AuthResponse response = new AuthResponse();
        if (!entity.isEmailValid()) {
            response.addError("Please provide valid email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (userService.findByEmail(entity) != null) {
            response.addError("User already registered");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
        response.setUser(userService.createUser(entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/activate")
    public ResponseEntity<AuthResponse> activate(HttpServletRequest request, @RequestBody UserEntity entity) {
        AuthResponse response = new AuthResponse();
        UserEntity user = userService.findByCode(entity);
        if (user == null) {
            response.addError("User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.setUser(userService.activateUser(entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
