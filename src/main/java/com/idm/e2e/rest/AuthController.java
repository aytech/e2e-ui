package com.idm.e2e.rest;

import com.idm.e2e.models.AuthRequest;
import com.idm.e2e.models.User;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    @RequestMapping(method = RequestMethod.POST, value = "/signin")
    public HttpEntity<Boolean> signIn(HttpServletRequest request, @RequestBody AuthRequest body) {
        // https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt

        User user = new User(body.getUsername(), body.getPassword());
        System.out.println("IP: " + request.getRemoteAddr());
        System.out.println("User: " + user);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }
}
