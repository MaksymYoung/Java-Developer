package org.example.controller;

import org.example.domain.GroupRole;
import org.example.domain.RoleType;
import org.example.service.GroupRoleService;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/roles")
public class GroupRoleController {

    @Autowired
    private GroupRoleService groupRoleService;

//    @Autowired
//    private KafkaTemplate<String, String> kafkaTemplate;

//    @Value("${spring.kafka.topics.group_changes}")
//    private String topicName;

    @GetMapping
    public ResponseEntity<List<GroupRole>> getGroupRoles(@PathVariable Long groupId) {
        List<GroupRole> roles = groupRoleService.getRolesByGroup(groupId);
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/assign")
    public ResponseEntity<Void> assignRole(@PathVariable Long groupId,
                                           @RequestParam Long adminId,
                                           @RequestParam Long userId,
                                           @RequestParam RoleType roleType) {
        if (groupRoleService.assignRole(groupId, adminId, userId, roleType)) {
//            kafkaTemplate.send(topicName, String.format(
//                    "Admin %d of the group %d assigned the role %s to the user %d",
//                    adminId, groupId, roleType.toString(), userId));
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(403).build();
        }
    }
}

