CREATE TABLE feed_changes (
                                       id BIGSERIAL PRIMARY KEY,
                                       feed_event_data TEXT NOT NULL,
                                       status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                                       creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE like_changes (
                              id BIGSERIAL PRIMARY KEY,
                              like_event_data TEXT NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                              creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment_changes (
                              id BIGSERIAL PRIMARY KEY,
                              comment_event_data TEXT NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                              creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_changes (
                              id BIGSERIAL PRIMARY KEY,
                              friend_event_data TEXT NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                              creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_changes (
                                id BIGSERIAL PRIMARY KEY,
                                group_event_data TEXT NOT NULL,
                                status VARCHAR(20) NOT NULL DEFAULT 'NEW',
                                creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
