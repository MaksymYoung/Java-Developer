DROP TABLE IF EXISTS group_participants CASCADE;
DROP TABLE IF EXISTS GROUP_MESSAGE CASCADE;
DROP TABLE IF EXISTS GROUP_CHAT CASCADE;
DROP TABLE IF EXISTS private_messages CASCADE;

CREATE TABLE private_messages (
                                  id SERIAL PRIMARY KEY,
                                  sender_id INTEGER NOT NULL,
                                  receiver_id INTEGER NOT NULL,
                                  content TEXT NOT NULL,
                                  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_chat (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            admin_id INTEGER
);

CREATE TABLE group_participants (
                                    group_id INTEGER REFERENCES group_chat(id) ON DELETE CASCADE,
                                    user_id INTEGER NOT NULL,
                                    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE group_message (
                               id SERIAL PRIMARY KEY,
                               sender_id INTEGER,
                               group_id INTEGER REFERENCES group_chat(id) ON DELETE CASCADE,
                               content TEXT NOT NULL,
                               timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);