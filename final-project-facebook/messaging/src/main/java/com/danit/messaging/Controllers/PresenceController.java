package com.danit.messaging.Controllers;



import com.danit.messaging.Service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/msg")
public class PresenceController {

    @Autowired
    private PresenceService presenceService;

    @GetMapping("/statusUser")
    public String getUserStatus(@RequestParam Integer userId) {
        boolean isOnline = presenceService.isUserOnline(userId);
        return isOnline ? "online" : "offline";
    }
}
