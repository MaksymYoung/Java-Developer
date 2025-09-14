CREATE TABLE IF NOT EXISTS private_messages (
                                                id SERIAL PRIMARY KEY,
                                                sender_id INTEGER NOT NULL,
                                                receiver_id INTEGER NOT NULL,
                                                content TEXT NOT NULL,
                                                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS group_chat (
                                                id SERIAL PRIMARY KEY,
                                                name VARCHAR(100) NOT NULL,
                                                admin_id INTEGER
    );

CREATE TABLE IF NOT EXISTS group_participants (
    group_id INTEGER REFERENCES group_chat(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id)
    );

CREATE TABLE IF NOT EXISTS group_message (
                                             id SERIAL PRIMARY KEY,
                                             sender_id INTEGER,
                                             group_id INTEGER REFERENCES group_chat(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );