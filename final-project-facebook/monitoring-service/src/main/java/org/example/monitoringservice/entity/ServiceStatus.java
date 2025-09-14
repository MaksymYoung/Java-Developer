package org.example.monitoringservice.entity;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ServiceStatus {
    String serviceName;
    Status serviceStatus;
}
