package com.idm.e2e.models;

import static com.idm.e2e.configuration.AppConstants.*;

public class EmailRequest {
//    private String host;
//    private String nodeID;
    private String recipient;
    private String subject;
    private String message;

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

//    public void generateReportDownloadedMessage() {
//        message = String.format("<p>%s job is complete</p>", APP_NAME) +
//                String.format("<p><a href=\"%s\">Download full report</a></p>", getReportsDownloadPath()) +
//                "<p>Yours,<br>" +
//                String.format("%s</p>", APP_NAME);
//    }

//    private String getReportsDownloadPath() {
//        String path = "";
//        String[] urlParts = host.split("/");
//        if (urlParts.length >= 3) {
//            String base = host.substring(0, host.indexOf(urlParts[3]) - 1);
//            return String.format("%s%s/%s", base, URI_DOWNLOAD_REPORT_PATH, nodeID);
//        }
//        if (host.substring(host.length() - 1).equals("/")) {
//            host = host.substring(0, host.length() - 1);
//        }
//        return String.format("%s%s/%s", host, URI_DOWNLOAD_REPORT_PATH, nodeID);
//    }
}
