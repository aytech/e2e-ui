package com.idm.e2e.web.rest;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.FilesResource;
import com.idm.e2e.web.data.StatusStorage;
import com.idm.e2e.web.data.ZipResource;
import com.idm.e2e.web.interfaces.DockerRunnable;
import com.idm.e2e.web.models.*;
import com.idm.e2e.web.processes.DockerBuild;
import com.idm.e2e.web.processes.DockerRun;
import com.idm.e2e.web.processes.FileSystemConfiguration;
import com.idm.e2e.web.processes.ThreadRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

import static com.idm.e2e.web.configuration.AppConstants.*;

@RestController
@RequestMapping(value = "/api")
public class BuildController {

    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_BUILD_STATUS,
            params = {"node"}
    )
    public HttpEntity<DockerBuildStatus> getStatus(@RequestParam("node") String nodeID) {
        DockerBuildStatus status = StatusStorage.getStatus(nodeID);
        status.setReportAvailable(ZipResource.isReportAvailable());
        status.setHasOldConfiguration(FilesResource.hasOldConfigurationFiles());
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_RUN_E2E)
    public HttpEntity<DockerRunResponse> runSuite(@RequestBody DockerRunRequest request) {
        DockerRunResponse response = new DockerRunResponse();
        if (request.isEmailValid()) {
            E2EConfiguration configuration = new E2EConfiguration();
            configuration.setUser(request.getEmail());
            configuration.setPassword(request.getPassword());
            configuration.setNodeID(DockerCommands.getNewE2ENode());

//            ArrayList<DockerRunnable> jobs = new ArrayList<>();
//            jobs.add(new FileSystemConfiguration(configuration));
//            jobs.add(new DockerBuild(configuration));
//            jobs.add(new DockerRun(configuration));
//
//            try {
//                ThreadRunner.getInstance().run(jobs);
//            } catch (IllegalStateException e) {
//                System.out.println("Can't run job: " + e.getMessage());
//                e.printStackTrace();
//            }
            response.setNodeID(configuration.getNodeID());
            response.setValid(true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setValid(false);
            response.addError("Enter valid email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = URI_DOWNLOAD_REPORT)
    public ResponseEntity<Resource> downloadReport(HttpServletRequest request) {
        ZipResource.zipE2EReports();
        String homeDirectory = System.getProperty("user.home");
        String zipFile = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, "report.zip");
        Path path = Paths.get(zipFile);
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

    @RequestMapping(method = RequestMethod.GET, value = URI_CLEAN_CONFIG)
    public HttpEntity<DockerBuildStatus> cleanConfigurationFiles() {
        FilesResource.cleanConfigurationFiles();
        // DockerBuildStatus status = StatusStorage.getStatus();
        // status.setReportAvailable(ZipResource.isReportAvailable());
        // status.setHasOldConfiguration(FilesResource.hasOldConfigurationFiles());
        return new ResponseEntity<>(null, HttpStatus.OK);
    }
}
