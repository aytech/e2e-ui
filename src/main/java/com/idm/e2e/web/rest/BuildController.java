package com.idm.e2e.web.rest;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.data.ZipResource;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.*;
import com.idm.e2e.web.processes.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import static com.idm.e2e.web.configuration.AppConstants.*;
import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_CHROME_NODE;
import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_E2E_NODE;

@RestController
@RequestMapping(value = URI_BASE)
public class BuildController {

    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_BUILD_STATUS,
            params = {"node"}
    )
    public HttpEntity<DockerBuildStatus> getStatus(@RequestParam("node") String nodeID) {
        DockerBuildStatus status = StatusStorage.getStatus(nodeID);
        E2EConfiguration configuration = new E2EConfiguration();
        configuration.setNodeID(nodeID);
        ZipResource resource = new ZipResource(configuration);
        status.setReportAvailable(resource.isReportAvailable());
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(@RequestBody DockerRunRequest request) {
        DockerRunResponse response = new DockerRunResponse();
        if (request.isEmailValid()) {
            String nodeID = DockerCommands.getNewE2ENode();
            E2EConfiguration configuration = new E2EConfiguration();
            configuration.setUser(request.getEmail());
            configuration.setPassword(request.getPassword());
            configuration.setBranch(request.getBranch());
            configuration.setNodeID(nodeID);
            configuration.setDocumentType(request.getDocumentType());
            StatusStorage.setStatus(nodeID);

            ArrayList<DockerRunnable> jobs = new ArrayList<>();
            jobs.add(new FileSystemConfiguration(configuration));
            jobs.add(new DockerBuild(configuration));
            jobs.add(new DockerRun(configuration));

            try {
                new ThreadRunner(jobs, nodeID).start();
            } catch (IllegalStateException e) {
                System.out.println("Can't run jobs: " + e.getMessage());
                e.printStackTrace();
            }
            response.setNodeID(nodeID);
            response.setValid(true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setValid(false);
            response.addError("Enter valid email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_DOWNLOAD_REPORT,
            params = {"node"}
    )
    public ResponseEntity<Resource> downloadReport(
            HttpServletRequest request,
            @RequestParam("node") String nodeID
    ) {
        E2EConfiguration configuration = new E2EConfiguration();
        configuration.setNodeID(nodeID);
        ZipResource zipResource = new ZipResource(configuration);
        String zipFilePath = zipResource.zipE2EReports();
        Path path = Paths.get(zipFilePath);
        try {
            Resource resource = new UrlResource(path.toUri());
            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename())
                    .body(resource);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_STOP_PROCESS,
            params = {"node"}
    )
    public ResponseEntity<DockerStopResponse> stopTest(@RequestParam("node") String nodeID) {
        DockerStopResponse response = new DockerStopResponse(nodeID);
        DockerUtility dockerUtility = new DockerUtility(String.format(DOCKER_E2E_NODE, nodeID));
//        E2EConfiguration configuration = new E2EConfiguration();
//        configuration.setNodeID(nodeID);
//        FilesResource filesResource = new FilesResource(configuration);

        List<String> nodes = new ArrayList<>();
        nodes.add(String.format(DOCKER_CHROME_NODE, nodeID));
        nodes.add(String.format(DOCKER_E2E_NODE, nodeID));

        dockerUtility.stopNodes(nodes);
//        filesResource.removeConfigurationDirectory();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
