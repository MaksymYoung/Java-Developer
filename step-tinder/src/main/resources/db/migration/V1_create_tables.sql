CREATE TABLE IF NOT EXISTS users
(
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username  TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    picture   TEXT NOT NULL,
    password  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS likes
(
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_from UUID    NOT NULL,
    user_to   UUID    NOT NULL,
    value     BOOLEAN NOT NULL,
    CONSTRAINT user_likes_users_from_fk FOREIGN KEY (user_from) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT user_likes_users_to_fk FOREIGN KEY (user_to) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages
(
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_from UUID NOT NULL,
    user_to   UUID NOT NULL,
    content   TEXT,
    time      BIGINT           DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
    CONSTRAINT messages_users_from_fk FOREIGN KEY (user_from) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT messages_users_to_fk FOREIGN KEY (user_to) REFERENCES users (id) ON DELETE CASCADE
);
