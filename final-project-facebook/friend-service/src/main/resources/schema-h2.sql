BEGIN;

DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS friends;

CREATE TABLE friend_requests
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id    BIGINT      NOT NULL,
    receiver_id  BIGINT      NOT NULL,
    status       VARCHAR(20) NOT NULL,
    created_date TIMESTAMP   NOT NULL,
    updated_date TIMESTAMP   NOT NULL
);

CREATE TABLE friends
(
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL
);

CREATE UNIQUE INDEX idx_friend_unique_users ON friends (user1_id, user2_id);


COMMIT;
