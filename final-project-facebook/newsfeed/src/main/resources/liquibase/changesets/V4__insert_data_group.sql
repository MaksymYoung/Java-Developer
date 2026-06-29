
INSERT INTO feeds (content, post_date, user_id, group_id) VALUES
    ('Feed content for group 1', '2024-07-17 10:00:00', 1, 1),
    ('Another feed for group 1', '2024-07-17 11:00:00', 2, 1),
    ('Feed content for group 2', '2024-07-17 12:00:00', 3, 2),
    ('Another feed for group 2', '2024-07-17 13:00:00', 4, 2);

INSERT INTO comments (feed_id, user_id, comment, created_at) VALUES
    (1, 1, 'This is a comment for feed 1 in group 1', '2024-07-17 10:05:00'),
    (1, 2, 'Another comment for feed 1 in group 1', '2024-07-17 10:10:00'),
    (2, 3, 'This is a comment for feed 2 in group 1', '2024-07-17 11:05:00'),
    (3, 4, 'This is a comment for feed 1 in group 2', '2024-07-17 12:05:00'),
    (4, 1, 'This is a comment for feed 2 in group 2', '2024-07-17 13:05:00');