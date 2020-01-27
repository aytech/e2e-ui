package com.idm.e2e.resources;

import javax.servlet.http.HttpServletRequest;

public class URLResource {
    public static String getBaseUrl(HttpServletRequest servletRequest) {
        String scheme = servletRequest.getScheme();
        String serverName = servletRequest.getServerName();
        int serverPort = servletRequest.getServerPort();

        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);

        if (serverPort != 80 && serverPort != 443) {
            url.append(":").append(serverPort);
        }

        return url.toString();
    }
}
