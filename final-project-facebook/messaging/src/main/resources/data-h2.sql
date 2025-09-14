-- Генерируем диалоги между пользователями
-- Диалог между user1 и user2
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (1, 2, 'Hello user2!', '2024-07-10 10:00:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (2, 1, 'Hi user1, how are you?', '2024-07-10 10:01:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (1, 2, 'I am good, thanks! And you?', '2024-07-10 10:02:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (2, 1, 'I am fine too!', '2024-07-10 10:03:00');

-- Диалог между user2 и user3
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (2, 3, 'Hey user3!', '2024-07-11 14:00:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (3, 2, 'Hello user2!', '2024-07-11 14:01:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (2, 3, 'What are you doing?', '2024-07-11 14:02:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (3, 2, 'Just working on a project.', '2024-07-11 14:03:00');

-- Диалог между user1 и user3
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (1, 3, 'Hi user3!', '2024-07-12 09:00:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (3, 1, 'Hey user1!', '2024-07-12 09:01:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (1, 3, 'Long time no see!', '2024-07-12 09:02:00');
INSERT INTO PRIVATE_MESSAGES (sender_id, receiver_id, content, timestamp) VALUES (3, 1, 'Yes, it has been a while. How have you been?', '2024-07-12 09:03:00');

-- Создаем групповые чаты
INSERT INTO GROUP_CHAT (name, admin_id) VALUES ('Friends Chat', 1);
INSERT INTO GROUP_CHAT (name, admin_id) VALUES ('Work Chat', 2);
INSERT INTO GROUP_CHAT (name, admin_id) VALUES ('Family Chat', 3);

-- Добавляем участников в групповые чаты
-- Участники для "Friends Chat"
INSERT INTO group_participants (group_id, user_id) VALUES (1, 1);
INSERT INTO group_participants (group_id, user_id) VALUES (1, 2);
INSERT INTO group_participants (group_id, user_id) VALUES (1, 3);

-- Участники для "Work Chat"
INSERT INTO group_participants (group_id, user_id) VALUES (2, 2);
INSERT INTO group_participants (group_id, user_id) VALUES (2, 4);
INSERT INTO group_participants (group_id, user_id) VALUES (2, 5);

-- Участники для "Family Chat"
INSERT INTO group_participants (group_id, user_id) VALUES (3, 3);
INSERT INTO group_participants (group_id, user_id) VALUES (3, 4);

-- Создаем сообщения в групповых чатах
-- Сообщения для "Friends Chat"
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (1, 1, 'Hey everyone!', '2024-07-13 10:00:00');
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (2, 1, 'Hello user1!', '2024-07-13 10:01:00');
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (3, 1, 'Hi all!', '2024-07-13 10:02:00');

-- Сообщения для "Work Chat"
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (2, 2, 'Meeting at 2 PM.', '2024-07-14 09:00:00');
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (4, 2, 'Got it. See you there.', '2024-07-14 09:01:00');
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (5, 2, 'I will join remotely.', '2024-07-14 09:02:00');

-- Сообщения для "Family Chat"
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (3, 3, 'Family dinner this Sunday?', '2024-07-15 18:00:00');
INSERT INTO GROUP_MESSAGE (sender_id, group_id, content, timestamp) VALUES (4, 3, 'Yes, let’s do it!', '2024-07-15 18:01:00');

