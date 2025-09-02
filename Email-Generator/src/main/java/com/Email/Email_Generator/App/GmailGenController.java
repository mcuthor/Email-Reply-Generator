package com.Email.Email_Generator.App;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class GmailGenController {

    private final EmailGeneratorService emailGeneratorService;
    @PostMapping("/generate")
   public  ResponseEntity<String>   generateEmail(@RequestBody EmailRequest emailRequest){
        String response = emailGeneratorService.generateEmailReply(emailRequest);
       return ResponseEntity.ok(response);

   }
}
