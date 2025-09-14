INSERT INTO groups_table (name, description, cover_image_url, group_type, owner_id, created_date, last_modified_date)
VALUES
    ('Open Group', 'A group that anyone can join without permission.', 'https://www.opengroup.org/sites/default/files/The-Open-Group-stacked-logo_3_0_0.jpg', 'OPEN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Private Group', 'A group that requires admin permission to join.', 'https://about.fb.com/wp-content/uploads/2020/10/NRP-Privacy_Matters_New_Public_Groups_banner_FINAL-1.jpg?w=1536', 'PRIVATE', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Technology Enthusiasts', 'A group for people who love technology.', 'https://scx2.b-cdn.net/gfx/news/hires/2015/techenthusia.jpg', 'OPEN', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Book Lovers Club', 'A community for book enthusiasts.', 'https://www.pinehills.com/images/events/_fullWidth/Book-Love-Book-Club.jpg', 'OPEN', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Fitness Fanatics', 'Group focused on fitness and health.', 'https://ftcustomapparel.com/cdn/shop/files/Asset_1_2x-100_ca127918-815c-4d10-9dd6-1979303eb2a0.jpg?v=1695057129&width=750', 'OPEN', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Travel Explorers', 'Discover the world with fellow travelers.', 'https://www.costsavertour.com/media/chgn2fbf/greek-island-explorer-guided-tour-1.jpg?crop=0.23942145616319446%2C0%2C0.09524521050347218%2C0&cropmode=percentage&format=webp&mode=crop&width=900&height=900&quality=80', 'PRIVATE', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Artists Hub', 'Connect with artists and share your creations.', 'https://images.nightcafe.studio/jobs/ieuM6PC1PY2YCSxlIV1n/ieuM6PC1PY2YCSxlIV1n--1--zhh7h.jpg?tr=w-1600,c-at_max', 'OPEN', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Foodies Paradise', 'For those who love to explore different cuisines.', 'https://img.freepik.com/premium-photo/foodie-paradise_1029473-206790.jpg?w=740', 'OPEN', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



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
