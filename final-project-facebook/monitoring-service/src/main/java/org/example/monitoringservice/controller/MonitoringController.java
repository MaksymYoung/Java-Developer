package org.example.monitoringservice.controller;


import lombok.RequiredArgsConstructor;
import org.example.monitoringservice.entity.ServiceStatus;
import org.example.monitoringservice.service.MonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/monitoring")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping("/showStatuses")
    public String showServicesStatus(Model model){

        model.addAttribute("serviceStatuses", monitoringService.getStatusesList());
        return "status-list";
    }

//    @GetMapping("/test")
//    public ResponseEntity<?> test(){
//        return ResponseEntity.ok(monitoringService.getServiceStatus("http://localhost:9080/actuator/health").getStatus().toString());
//    }
}
