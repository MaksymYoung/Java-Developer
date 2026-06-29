package org.example.monitoringservice.service;

import lombok.RequiredArgsConstructor;
import org.example.monitoringservice.dto.StatusDto;
import org.example.monitoringservice.entity.ServiceStatus;
import org.example.monitoringservice.entity.Status;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitoringService {


    private final RestTemplate restTemplate;


    public List<ServiceStatus> getStatusesList()  {
        List<ServiceStatus> serviceStatuses = new ArrayList<>();

        ServiceStatus authServiceStatus = new ServiceStatus();
        authServiceStatus.setServiceName("auth-service");
        authServiceStatus.setServiceStatus(getServiceStatus("ec2-13-60-41-135.eu-north-1.compute.amazonaws.com:9080"));

        ServiceStatus friendServiceStatus = new ServiceStatus();
        friendServiceStatus.setServiceName("friend-service");
        friendServiceStatus.setServiceStatus(getServiceStatus("ec2-13-60-230-139.eu-north-1.compute.amazonaws.com:8095"));

        ServiceStatus messaging = new ServiceStatus();
        messaging.setServiceName("messaging");
        messaging.setServiceStatus(getServiceStatus("ec2-13-61-26-244.eu-north-1.compute.amazonaws.com:8082"));

        ServiceStatus userprofile = new ServiceStatus();
        userprofile.setServiceName("userprofile");
        userprofile.setServiceStatus(getServiceStatus("ec2-13-60-28-25.eu-north-1.compute.amazonaws.com:8091"));

        ServiceStatus newsfeed = new ServiceStatus();
        newsfeed.setServiceName("userprofile");
        newsfeed.setServiceStatus(getServiceStatus("ec2-3-86-165-75.compute-1.amazonaws.com:8081"));

        ServiceStatus groupService = new ServiceStatus();
        groupService.setServiceName("group-service");
        groupService.setServiceStatus(getServiceStatus("ec2-13-49-67-111.eu-north-1.compute.amazonaws.com:9000"));




        serviceStatuses.add(authServiceStatus);
        serviceStatuses.add(friendServiceStatus);
        serviceStatuses.add(messaging);
        serviceStatuses.add(userprofile);
        serviceStatuses.add(newsfeed);
        serviceStatuses.add(groupService);

        return serviceStatuses;
    }

    public Status getServiceStatus(String urlName)  {
        if(exists(urlName)){
            if(restTemplate.getForObject("http://" + urlName, StatusDto.class).getStatus().equals("UP")){
                return Status.OK;
            } else {
                return Status.FAILURE;
            }
        } else {
            return Status.FAILURE;
        }

    }

    public boolean exists(String URLName) {
        try {
            if (!URLName.toUpperCase().contains("HTTP"))
                URLName="http://"+URLName;
            URL url = new URL(URLName);
            System.setProperty("java.net.useSystemProxies", "true");
            HttpURLConnection urlConn = (HttpURLConnection)  url.openConnection();
            urlConn.setConnectTimeout(9000);
            urlConn.setReadTimeout(9000);
            urlConn.connect();
            if(HttpURLConnection.HTTP_OK == urlConn.getResponseCode())
                return true;
            else
                return false;
        }
        catch (SocketTimeoutException e){
            return false;
        }

        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
