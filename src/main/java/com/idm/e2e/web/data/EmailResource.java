package com.idm.e2e.web.data;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Base64;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.common.base.Verify;
import com.idm.e2e.web.models.EmailRequest;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.*;
import java.security.GeneralSecurityException;
import java.util.*;

import static com.google.api.client.googleapis.auth.oauth2.GoogleOAuthConstants.OOB_REDIRECT_URI;
import static com.idm.e2e.web.configuration.AppConstants.*;

public class EmailResource {
    private final JsonFactory JSON_FACTORY;
    private final List<String> gmailScopes;
    private String authorizationURL;
    private String statusMessage;
    private GoogleAuthorizationCodeFlow authorizationCodeFlow;

    public EmailResource() {
        JSON_FACTORY = JacksonFactory.getDefaultInstance();
        List<String> scopes = new ArrayList<>();
        scopes.add(GmailScopes.GMAIL_COMPOSE);
        scopes.add(GmailScopes.GMAIL_SEND);
        scopes.add(GmailScopes.GMAIL_METADATA);
        gmailScopes = Collections.unmodifiableList(scopes);
    }

    public Boolean sendGmail(EmailRequest email) throws MessagingException, IOException, GeneralSecurityException {
        Gmail gmail = getService();
        Properties properties = new Properties();
        Session session = Session.getDefaultInstance(properties);
        MimeMessage mail = new MimeMessage(session);

        mail.setFrom(new InternetAddress(EMAIL_FROM));
        mail.setReplyTo(new InternetAddress[]{new InternetAddress(EMAIL_FROM)});
        mail.addRecipient(Message.RecipientType.TO, new InternetAddress(email.getRecipient()));
        mail.setSubject(EMAIL_SUBJECT);

        MimeBodyPart bodyPart = new MimeBodyPart();
        bodyPart.setContent(email.getMessage(), "text/html");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(bodyPart);

        mail.setContent(multipart);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        mail.writeTo(outputStream);
        String encodedEmail = Base64.encodeBase64URLSafeString(outputStream.toByteArray());
        com.google.api.services.gmail.model.Message message = new com.google.api.services.gmail.model.Message();
        message.setRaw(encodedEmail);
        message = gmail.users().messages().send("me", message).execute();

        if (message.getId() == null) {
            statusMessage = String.format("Message %s could not be sent", message.toPrettyString());
            return false;
        } else {
            statusMessage = String.format("Message %s was sent successfully", message.getId());
            return true;
        }
    }

    public Boolean isCredentialStored() throws GeneralSecurityException, IOException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        setAuthorizationFlow(HTTP_TRANSPORT);
        if (authorizationCodeFlow.loadCredential(GMAIL_USER) == null) {
            authorizationURL = authorizationCodeFlow.newAuthorizationUrl().setRedirectUri(OOB_REDIRECT_URI).build();
            return false;
        }
        return true;
    }

    public void createAndStoreCredential(String authCode) throws IOException, GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        setAuthorizationFlow(HTTP_TRANSPORT);
        GoogleTokenResponse response = authorizationCodeFlow.newTokenRequest(authCode)
                .setRedirectUri(OOB_REDIRECT_URI)
                .execute();
        authorizationCodeFlow.createAndStoreCredential(response, GMAIL_USER);
    }

    private Gmail getService() throws IOException, GeneralSecurityException, AuthenticationFailedException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        setAuthorizationFlow(HTTP_TRANSPORT);
        Credential credential = authorizationCodeFlow.loadCredential(GMAIL_USER);

        if (credential == null) {
            throw new AuthenticationFailedException("User credentials not found");
        }

        return new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APP_NAME)
                .build();
    }

    private void setAuthorizationFlow(NetHttpTransport HTTP_TRANSPORT) throws IOException {
        InputStream inputStream = getCredentialsStream();
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(inputStream));

        // Build flow and trigger user authorization request.
        authorizationCodeFlow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, gmailScopes)
                .setDataStoreFactory(getDataStoreFactory())
                .setAccessType(GMAIL_ACCESS_TYPE)
                .build();
    }

    private FileDataStoreFactory getDataStoreFactory()
            throws IOException {
        File tokenDirectory = new File(getUserHomeDir(), GMAIL_DATA_STORE_PATH);
        return new FileDataStoreFactory(tokenDirectory);
    }

    private InputStream getCredentialsStream() throws FileNotFoundException {
        File credentials = new File(getUserHomeDir(), GMAIL_CREDENTIALS_PATH);
        return new FileInputStream(credentials);
    }

    private File getUserHomeDir() {
        File userHome = new File(System.getProperty("user.home"));
        Verify.verify(userHome.exists() && userHome.canRead(),
                "Can not find user's home: %s", userHome);
        return userHome;
    }

    public String getAuthorizationURL() {
        return authorizationURL;
    }

    public String getStatusMessage() {
        return statusMessage;
    }
}
