package com.idm.e2e.rest;

import com.idm.e2e.data.FilesResource;
import com.idm.e2e.data.ZipResource;
import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.SystemVariableEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.entities.VariableEntity;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.models.*;
import com.idm.e2e.processes.ChromeNode;
import com.idm.e2e.processes.SeleniumGrid;
import com.idm.e2e.processes.ThreadRunner;
import com.idm.e2e.services.DockerService;
import com.idm.e2e.services.NodeService;
import com.idm.e2e.services.VariableService;
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
import java.util.List;

import static com.idm.e2e.configuration.AppConstants.*;

@RestController
@RequestMapping(value = URI_API_BASE)
public class BuildController {

    final NodeService nodeService;
    final DockerService dockerService;
    final VariableService variableService;

    public BuildController(
            NodeService nodeService,
            DockerService dockerService,
            VariableService variableService) {
        this.nodeService = nodeService;
        this.dockerService = dockerService;
        this.variableService = variableService;
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_NODE, params = {"node"})
    public HttpEntity<JobNode> getNodeStatus(HttpServletRequest request, @RequestParam("node") String nodeId) {
        JobNode node = nodeService.getNode(Long.parseLong(nodeId));
        if (node.getTag() == null) {
            return new ResponseEntity<>(node, HttpStatus.NOT_FOUND);
        }
        String e2eContainerName = String.format("%s%s", node.getTag(), NODE_E2E_SUFFIX);
        boolean isNodeContainerRunning = dockerService.getNodeRunningStatus(node.getTag());
        boolean isSuiteContainerRunning = dockerService.getNodeRunningStatus(e2eContainerName);
        node.setStoppable(isNodeContainerRunning || isSuiteContainerRunning);
        return new ResponseEntity<>(node, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = URI_NODE_REMOVE)
    public HttpEntity<GenericResponse> removeNode(HttpServletRequest request, @RequestBody NodeEntity nodeEntity) {
        GenericResponse response = new GenericResponse(false);
        JobNode node = nodeService.getNode(nodeEntity.getId());
        if (node.getTag() == null) {
            response.setMessage("Node not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        FilesResource filesResource = new FilesResource(node.getTag());
        try {
            if (!filesResource.getNodePath().exists()) {
                response.setSuccess(nodeService.removeNode(nodeEntity));
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            FileUtils.forceDelete(filesResource.getNodePath());
            response.setSuccess(nodeService.removeNode(nodeEntity));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            response.setMessage(e.getMessage());
            e.printStackTrace();
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(Authentication authentication, @RequestBody Object body) {
        DockerRunResponse response = new DockerRunResponse();
        UserEntity user = (UserEntity) authentication.getPrincipal();
        List<SystemVariableEntity> systemVariables = variableService.getSystemVariablesInternal();
        List<VariableEntity> userVariables = variableService.getUserVariablesInternal(user);
        ArrayList<DockerRunnable> jobs = new ArrayList<>();
        jobs.add(new SeleniumGrid());
        jobs.add(new ChromeNode(user, systemVariables, userVariables));
        try {
            new ThreadRunner(jobs, "test").start();
        } catch (IllegalStateException e) {
            System.out.println("Exception: " + e.getMessage());
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_DOWNLOAD_REPORT, params = {"node"})
    public ResponseEntity<Resource> downloadReport(
            HttpServletRequest request,
            @RequestParam("node") String nodeId
    ) {
        JobNode node = nodeService.getNode(Long.parseLong(nodeId));
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

    @RequestMapping(method = RequestMethod.GET, value = URI_STOP_PROCESS, params = {"node"})
    public ResponseEntity<GenericResponse> stopTest(@RequestParam("node") String nodeId) {
        GenericResponse response = new GenericResponse();
        JobNode node = nodeService.getNode(Long.parseLong(nodeId));
        if (node.getTag() == null) {
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        String e2eContainerName = String.format("%s%s", node.getTag(), NODE_E2E_SUFFIX);
        boolean isNodeContainerRunning = dockerService.getNodeRunningStatus(node.getTag());
        boolean isSuiteContainerRunning = dockerService.getNodeRunningStatus(e2eContainerName);
        if (isSuiteContainerRunning) {
            dockerService.stopNodeContainer(e2eContainerName);
        }
        if (isNodeContainerRunning) {
            dockerService.stopNodeContainer(node.getTag());
        }
        response.setSuccess(true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
