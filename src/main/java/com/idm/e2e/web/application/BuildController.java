package com.idm.e2e.web.application;

import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.*;
import com.idm.e2e.web.processes.DockerBuild;
import com.idm.e2e.web.processes.DockerCompose;
import com.idm.e2e.web.processes.DockerRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;

import static com.idm.e2e.web.configuration.AppConstants.*;

@RestController
@RequestMapping(value = "/api")
public class BuildController {

    @RequestMapping(method = RequestMethod.GET, value = URI_BUILD_STATUS)
    public HttpEntity<DockerBuildStatus> getStatus() {
        DockerBuildStatus status = StatusStorage.getCurrentStatus();
        if (status.isRunning()) {
            return new ResponseEntity<>(status, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(StatusStorage.getPreviousStatus(), HttpStatus.OK);
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(@RequestBody DockerRunRequest request) {
        DockerRunResponse response = new DockerRunResponse();
        if (request.isEmailValid()) {
            E2EConfiguration configuration = new E2EConfiguration();
            ArrayList<DockerRunnable> jobs = new ArrayList<>();
            jobs.add(new DockerBuild());
            jobs.add(new DockerCompose());
            configuration.setUser(request.getUser());
            configuration.setPassword(request.getPassword());
            FilesResource filesResource = new FilesResource(configuration);

            try {
                filesResource.writeNewConfigurationFile(CONFIGURATION_SAMPLE, CONFIGURATION);
                filesResource.writeNewCredentialsFile(CREDENTIALS_SAMPLE, CREDENTIALS);
                filesResource.writeDockerFile(DOCKERFILE_SAMPLE, DOCKERFILE);
                DockerRunner.getInstance().run(jobs);
            } catch (IOException | IllegalStateException e) {
                System.out.println("Can't add configuration: " + e.getMessage());
                e.printStackTrace();
            }
            response.setValid(true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setValid(false);
            response.addError("Enter valid email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}
