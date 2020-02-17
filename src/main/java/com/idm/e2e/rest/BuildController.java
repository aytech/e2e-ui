package com.idm.e2e.rest;

import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.models.*;
import com.idm.e2e.processes.ChromeNode;
import com.idm.e2e.processes.SeleniumGrid;
import com.idm.e2e.processes.ThreadRunner;
import com.idm.e2e.resources.DockerResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import java.util.ArrayList;

import static com.idm.e2e.configuration.AppConstants.*;
import static com.idm.e2e.configuration.DockerConstants.*;

@RestController
@RequestMapping(value = URI_API_BASE)
public class BuildController {

//    @RequestMapping(
//            method = RequestMethod.GET,
//            value = URI_BUILD_STATUS,
//            params = {"node"}
//    )
//    public HttpEntity<DockerBuildStatus> getStatus(@RequestParam("node") String nodeID) {
//        DockerBuildStatus status = StatusStorage.getStatus(nodeID);
//        E2EConfiguration configuration = new E2EConfiguration();
//        configuration.setNodeID(nodeID);
//        DockerResource utility = new DockerResource(String.format(DOCKER_E2E_NODE, nodeID));
//        try {
//            status.setCanBeStopped(utility.isContainerCreated());
//        } catch (IOException exception) {
//            status.addStdErrorEntry(exception.getMessage());
//            return new ResponseEntity<>(status, HttpStatus.SERVICE_UNAVAILABLE);
//        }
//        ZipResource resource = new ZipResource(configuration);
//        status.setReportAvailable(resource.isReportAvailable());
//        return new ResponseEntity<>(status, HttpStatus.OK);
//    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(HttpServletRequest request, @RequestBody Object body) {
        DockerRunResponse response = new DockerRunResponse();
        ArrayList<DockerRunnable> jobs = new ArrayList<>();
        jobs.add(new SeleniumGrid());
        jobs.add(new ChromeNode());

        try {
            new ThreadRunner(jobs, "test").start();
        } catch (IllegalStateException e) {
            System.out.println("Exception: " + e.getMessage());
        }

        // Run Chrome Node (make sure it's killed after run)

        // Run suite

        return new ResponseEntity<>(response, HttpStatus.OK);
//        if (body.isEmailValid()) {
//            String nodeID = DockerCommandsResource.getNewE2ENode();
//            E2EConfiguration configuration = new E2EConfiguration();
//            configuration.setUser(body.getEmail());
//            configuration.setPassword(body.getPassword());
//            configuration.setBranch(body.getBranch());
//            configuration.setNodeID(nodeID);
//            configuration.setDocumentType(body.getDocumentType());
//            configuration.setRequestHost(request.getRequestURL().toString());
//            StatusStorage.setStatus(nodeID);
//
//            ArrayList<DockerRunnable> jobs = new ArrayList<>();
//            jobs.add(new FileSystemConfiguration(configuration));
//            jobs.add(new DockerBuild(configuration));
//            jobs.add(new DockerRun(configuration));
//
//            try {
//                new ThreadRunner(jobs, nodeID).start();
//            } catch (IllegalStateException e) {
//                System.out.println("Can't run jobs: " + e.getMessage());
//                e.printStackTrace();
//            }
//            response.setNodeID(nodeID);
//            response.setValid(true);
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } else {
//            response.setValid(false);
//            response.addError("Enter valid email");
//            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
//        }
    }

//    @RequestMapping(
//            method = RequestMethod.GET,
//            value = URI_DOWNLOAD_REPORT,
//            params = {"node"}
//    )
//    public ResponseEntity<Resource> downloadReport(
//            HttpServletRequest request,
//            @RequestParam("node") String nodeID
//    ) {
//        E2EConfiguration configuration = new E2EConfiguration();
//        configuration.setNodeID(nodeID);
//        ZipResource zipResource = new ZipResource(configuration);
//        String zipFilePath = zipResource.zipE2EReports();
//        Path path = Paths.get(zipFilePath);
//        try {
//            Resource resource = new UrlResource(path.toUri());
//            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
//            if (contentType == null) {
//                contentType = "application/octet-stream";
//            }
//            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(contentType))
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename())
//                    .body(resource);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }

//    @RequestMapping(
//            method = RequestMethod.GET,
//            value = URI_STOP_PROCESS,
//            params = {"node"}
//    )
//    public ResponseEntity<DockerStopResponse> stopTest(@RequestParam("node") String nodeID) {
//        DockerStopResponse response = new DockerStopResponse(nodeID);
//        DockerResource dockerUtility = new DockerResource(String.format(DOCKER_E2E_NODE, nodeID));
//
//        List<String> containers = new ArrayList<>();
//        containers.add(String.format(DOCKER_CHROME_NODE, nodeID));
//        containers.add(String.format(DOCKER_E2E_NODE, nodeID));
//        dockerUtility.stopRunningContainers(containers);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
}
