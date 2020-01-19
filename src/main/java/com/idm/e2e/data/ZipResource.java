package com.idm.e2e.data;

import com.idm.e2e.models.E2EConfiguration;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.idm.e2e.configuration.AppConstants.*;

public class ZipResource {
    private E2EConfiguration configuration;

    public ZipResource(E2EConfiguration configuration) {
        this.configuration = configuration;
    }

    public String zipE2EReports() {
        FilesResource resource = new FilesResource(configuration);
        File reportsDirectory = resource.getConfigurationDirectory(REPORT_DIR);
        String zipFile =
                String.format(
                        "%s%s%s",
                        resource.getConfigurationDirectory(null),
                        File.separator,
                        REPORT_ZIP
                );

        try {
            FileOutputStream fileOutputStream = new FileOutputStream(zipFile);
            ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);
            zipFile(reportsDirectory, reportsDirectory.getName(), zipOutputStream);
            zipOutputStream.close();
            fileOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return zipFile;
    }

    private static void zipFile(File fileToZip, String fileName, ZipOutputStream zipOutputStream) throws IOException {
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith(File.separator)) {
                zipOutputStream.putNextEntry(new ZipEntry(fileName));
                zipOutputStream.closeEntry();
            } else {
                zipOutputStream.putNextEntry(new ZipEntry(fileName + File.separator));
                zipOutputStream.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            if (children != null) {
                for (File childFile : children) {
                    zipFile(childFile, fileName + File.separator + childFile.getName(), zipOutputStream);
                }
            }
            return;
        }
        FileInputStream fileInputStream = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOutputStream.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fileInputStream.read(bytes)) >= 0) {
            zipOutputStream.write(bytes, 0, length);
        }
        fileInputStream.close();
    }

    public Boolean isReportAvailable() {
        if (configuration.getNodeID() == null) {
            return false;
        }
        FilesResource resource = new FilesResource(configuration);
        File reportsDirectory = resource.getConfigurationDirectory(REPORT_DIR);
        return reportsDirectory.exists();
    }
}
