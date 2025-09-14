INSERT INTO groups_table (name, description, cover_image_url, group_type, owner_id, created_date, last_modified_date)
VALUES
    ('Open Group', 'A group that anyone can join without permission.', '/groups/c4b2e4cb-4839-4005-8c93-88db8e6b48cc.jpg', 'OPEN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Private Group', 'A group that requires admin permission to join.', '/groups/c9646ab8-6d6b-4d53-8bc1-ac0c534393a5.jpg', 'PRIVATE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Technology Enthusiasts', 'A group for people who love technology.', 'https://scx2.b-cdn.net/gfx/news/hires/2015/techenthusia.jpg', 'OPEN', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Book Lovers Club', 'A community for book enthusiasts.', '/groups/9544c307-46f9-490d-839b-4b8d696f7a3a.jpg', 'OPEN', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Fitness Fanatics', 'Group focused on fitness and health.', '/groups/74ae86c1-1324-4e9c-a967-4b4d3bef95f4.jpg', 'OPEN', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Travel Explorers', 'Discover the world with fellow travelers.', '/groups/122a91d6-1e7e-4a85-bdc5-59c7cabf5edc.jpg', 'PRIVATE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Artists Hub', 'Connect with artists and share your creations.', '/groups/356353c6-52a8-420e-899c-d79f36981920.jpg', 'OPEN', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Foodies Paradise', 'For those who love to explore different cuisines.', '/groups/57de42f4-c99e-4053-b494-11175f3996d5.jpg', 'OPEN', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



INSERT INTO user_group (group_id, user_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 1),
    (4, 2),
    (5, 3),
    (6, 1),
    (7, 2),
    (8, 3);

INSERT INTO join_request (group_id, user_id, status)
VALUES (2, 1, 'PENDING'),
       (2, 2, 'PENDING'),
       (3, 1, 'PENDING');

INSERT INTO group_roles (role_type, group_id, user_id) VALUES
                                                           ('ADMIN', 1, 1),
                                                           ('MEMBER', 1, 2),
                                                           ('MODERATOR', 2, 2),
                                                           ('MEMBER', 2, 3),
                                                           ('ADMIN', 3, 3);
