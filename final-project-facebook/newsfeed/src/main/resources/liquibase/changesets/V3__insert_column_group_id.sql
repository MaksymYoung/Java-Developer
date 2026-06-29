ALTER TABLE feeds ADD COLUMN group_id BIGINT;


INSERT INTO comments (feed_id, user_id, comment)
VALUES
    (1, 1, 'Great article, very informative!'),
    (2, 2, 'I totally agree with this point of view.'),
    (3, 3, 'This was a very helpful post, thanks for sharing.'),
    (4, 1, 'Interesting perspective, I never thought about it that way.'),
    (5, 2, 'Thanks for the tips, they are really useful!'),
    (6, 3, 'I learned something new today, appreciated!'),
    (7, 1, 'Well written, keep up the good work!'),
    (8, 2, 'This is exactly what I was looking for, thanks!'),
    (9, 3, 'Can you provide more details on this topic?'),
    (10, 1, 'Excellent post, very well explained.'),
    (1, 2, 'I have a question about one of the points mentioned.'),
    (2, 3, 'This is a great read, very insightful.'),
    (3, 1, 'I think this could be improved with more examples.'),
    (4, 2, 'Thanks for the clarification on this issue.'),
    (5, 3, 'Looking forward to more posts like this!'),
    (6, 1, 'This was really helpful, thank you!'),
    (7, 2, 'Great insights, much appreciated.'),
    (8, 3, 'I love how you explained this concept.'),
    (9, 1, 'Very well written and easy to understand.'),
    (10, 2, 'This answered all my questions, thanks a lot!');