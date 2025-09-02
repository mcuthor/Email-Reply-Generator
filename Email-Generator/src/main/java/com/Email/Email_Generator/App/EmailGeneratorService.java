package com.Email.Email_Generator.App;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }


    public String generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPromt(emailRequest);
        // Build the prompt
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Do request and get RESPONSE
        String response = webClient.post()
                // --- THIS IS THE CORRECTED LINE ---
                // This builds the URL correctly by adding the API key as a query parameter
                .uri(geminiApiUrl, uriBuilder -> uriBuilder
                        .queryParam("key", geminiApiKey.trim())
                        .build())
                // --- END OF CORRECTION ---
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // extract response and return
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            // Add a check for errors in the response body
            if (rootNode.has("error")) {
                return "API Error: " + rootNode.path("error").path("message").asText();
            }
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            if (textNode.isMissingNode()){
                return "Error: Could not parse Gemini response. Full Response: " + response;
            }
            return textNode.asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPromt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a Professional email reply for the Following Email ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
