create table if not exists feeds
(
    id              bigserial primary key,
    content     varchar(500) null,
    post_date timestamp    null,
    user_id BIGINT not null
    );

create table if not exists newsfeed_images
(
    feed_id bigint       not null,
    image   varchar(255) not null,
    constraint fk_newsfeed_images_feed foreign key (feed_id) references feeds (id) on delete cascade on update no action
    );
CREATE TABLE IF NOT EXISTS comments (
                                        id BIGSERIAL PRIMARY KEY,
                                        feed_id BIGINT NOT NULL,
                                        user_id BIGINT NOT NULL,
                                        comment TEXT NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS likes (
                                     id BIGSERIAL PRIMARY KEY,
                                     feed_id BIGINT,
                                     comment_id BIGINT,
                                     user_id BIGINT NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     FOREIGN KEY (feed_id) REFERENCES feeds(id) ON DELETE CASCADE,
                                     FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
                                     CHECK (feed_id IS NOT NULL OR comment_id IS NOT NULL)
    );
