DROP TABLE IF EXISTS userprofile;
DROP TABLE IF EXISTS userprofile_images;

CREATE TABLE userprofile (
                              id BIGINT PRIMARY KEY AUTO_INCREMENT,
                              user_id BIGINT NOT NULL UNIQUE,
                              nickname VARCHAR(100),
                              company VARCHAR(128),
                              interests VARCHAR(400),
                              country VARCHAR(50),
                              state VARCHAR(50),
                              city VARCHAR(50),
                              address VARCHAR(100),
                              apartment VARCHAR(50),
                              postcode VARCHAR(50),
                              linkedin VARCHAR(100),
                              telegram VARCHAR(100),
                              viber VARCHAR(100)
);

CREATE TABLE userprofile_images (
                                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    userprofile_id BIGINT,
                                    image VARCHAR(255),
                                    FOREIGN KEY (userprofile_id) REFERENCES userprofile(id) ON DELETE CASCADE
);