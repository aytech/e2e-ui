package com.idm.e2e.rest;

import com.idm.e2e.data.FilesResource;
import com.idm.e2e.data.ZipResource;
import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.models.*;
import com.idm.e2e.processes.ChromeNode;
import com.idm.e2e.processes.SeleniumGrid;
import com.idm.e2e.processes.ThreadRunner;
import com.idm.e2e.services.NodeService;
import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import static com.idm.e2e.configuration.AppConstants.*;

@RestController
@RequestMapping(value = URI_API_BASE)
public class BuildController {

    final NodeService nodeService;

    public BuildController(NodeService nodeService) {
        this.nodeService = nodeService;
    }

    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_BUILD_STATUS,
            params = {"node"}
    )
    public HttpEntity<DockerBuildStatus> getStatus() {
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
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_NODE, params = {"node"})
    public HttpEntity<BasicNode> getNodeStatus(HttpServletRequest request, @RequestParam("node") String nodeId) {
        return new ResponseEntity<>(nodeService.getNode(Long.parseLong(nodeId)), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_NODE_REMOVE)
    public HttpEntity<Boolean> removeNode(HttpServletRequest request, @RequestBody NodeEntity nodeEntity) {
        BasicNode node = nodeService.getNode(nodeEntity.getId());
        if (node.getTag() == null) {
            return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
        }
        FilesResource filesResource = new FilesResource(node.getTag());
        try {
            if (!filesResource.getNodePath().exists()) {
                return new ResponseEntity<>(nodeService.removeNode(nodeEntity), HttpStatus.OK);
            }
            FileUtils.forceDelete(filesResource.getNodePath());
            return new ResponseEntity<>(nodeService.removeNode(nodeEntity), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(Authentication authentication, @RequestBody Object body) {
        DockerRunResponse response = new DockerRunResponse();
        UserEntity userEntity = (UserEntity) authentication.getPrincipal();
        ArrayList<DockerRunnable> jobs = new ArrayList<>();
        jobs.add(new SeleniumGrid());
        jobs.add(new ChromeNode(userEntity));

        try {
            new ThreadRunner(jobs, "test").start();
        } catch (IllegalStateException e) {
            System.out.println("Exception: " + e.getMessage());
        }

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

    @RequestMapping(method = RequestMethod.GET, value = URI_DOWNLOAD_REPORT, params = {"node"})
    public ResponseEntity<Resource> downloadReport(
            HttpServletRequest request,
            @RequestParam("node") String nodeId
    ) {
        BasicNode node = nodeService.getNode(Long.parseLong(nodeId));
        if (node.getTag() == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        ZipResource zipResource = new ZipResource(node.getTag());
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
