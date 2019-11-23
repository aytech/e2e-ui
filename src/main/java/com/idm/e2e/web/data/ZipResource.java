package com.idm.e2e.web.data;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static com.idm.e2e.web.configuration.AppConstants.*;

public class ZipResource {
    public static void zipE2EReports() {
        String homeDirectory = System.getProperty("user.home");
        String reportsDirectory = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, REPORT_DIR);
        String zipFile = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, REPORT_ZIP);

        try {
            FileOutputStream fileOutputStream = new FileOutputStream(zipFile);
            ZipOutputStream zipOutputStream = new ZipOutputStream(fileOutputStream);
            File dirToZip = new File(reportsDirectory);
            zipFile(dirToZip, dirToZip.getName(), zipOutputStream);
            zipOutputStream.close();
            fileOutputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
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

    public static Boolean isReportAvailable() {
        String homeDirectory = System.getProperty("user.home");
        String reportsDirectory = String.format("%s%s%s%s%s", homeDirectory, File.separator, CONFIGURATION_DIRECTORY, File.separator, REPORT_DIR);
        return new File(reportsDirectory).exists();
    }
}
