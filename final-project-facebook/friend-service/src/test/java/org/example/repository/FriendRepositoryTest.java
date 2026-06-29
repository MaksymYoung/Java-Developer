package org.example.repository;

import org.example.domain.Friend;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

@Disabled
@DataJpaTest
@ActiveProfiles("test")
public class FriendRepositoryTest {

    @Autowired
    private FriendRepository friendRepository;

    @Test
    public void testFindAllFriendsByUserId() {
        Long userId = 1L;
        // Assuming the repository is pre-populated with test data
        List<Friend> friends = friendRepository.findAllFriendsByUserId(userId);
        assertNotNull(friends);
    }

    @Test
    public void testExistsByUser1IdAndUser2IdOrUser2IdAndUser1Id() {
        Friend friend1 = new Friend(100L, 200L, 300L);
        Friend friend2 = new Friend(101L, 300L, 200L);
        friendRepository.save(friend1);
        friendRepository.save(friend2);
        boolean exists = friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(200L, 300L);
        assertTrue(exists);
    }

    // Additional test cases can be added for other methods.
}