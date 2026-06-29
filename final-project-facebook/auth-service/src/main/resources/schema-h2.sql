DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       first_name VARCHAR(255),
                       last_name VARCHAR(255),
                       phone_number VARCHAR(15),
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       birth_date DATE NOT NULL,
                       gender VARCHAR(10),
                       creation_date TIMESTAMP NULL,
                       last_modified_date TIMESTAMP NULL
);

CREATE TABLE accounts (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          created_at DATE NOT NULL,
                          is_active BOOLEAN NOT NULL,
                          user_id BIGINT,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          creation_date TIMESTAMP NULL,
                          last_modified_date TIMESTAMP NULL
);

CREATE TABLE password_reset_tokens (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       token VARCHAR(255) NOT NULL,
                                       user_id BIGINT NOT NULL,
                                       expiry_date TIMESTAMP NOT NULL,
                                       FOREIGN KEY (user_id) REFERENCES users(id)
);