package com.idm.e2e.rest;

import com.idm.e2e.UserService;
import com.idm.e2e.models.AuthRequest;
import com.idm.e2e.entities.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
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

    @RequestMapping(method = RequestMethod.POST, value = "/signin")
    public ResponseEntity<UserEntity> signIn(HttpServletRequest request, @RequestBody UserEntity userEntity) {
        // https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt
        System.out.println("IP: " + request.getRemoteAddr());
        System.out.println("User: " + userEntity);
        return new ResponseEntity<>(userService.createUser(userEntity), HttpStatus.OK);
    }
}
