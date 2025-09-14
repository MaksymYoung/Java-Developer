CREATE TABLE IF NOT EXISTS userprofiles (
                                            id BIGSERIAL PRIMARY KEY,
                                            user_id BIGINT UNIQUE NOT NULL,
                                            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

CREATE TABLE IF NOT EXISTS userprofile_images (
                                                  user_id BIGINT NOT NULL,
                                                  image VARCHAR(255) NOT NULL,
                                                  CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES userprofiles(user_id)
                                                      ON DELETE CASCADE
                                                      ON UPDATE NO ACTION
);
