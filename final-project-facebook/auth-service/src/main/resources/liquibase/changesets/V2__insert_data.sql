INSERT INTO users (first_name, last_name, phone_number, email, password, birth_date, gender) VALUES
                                                                                                 ('John', 'Doe', '+12345678901', 'pavlobarabah@gmail.com', 'password123', '1990-01-01', 'male'),
                                                                                                 ('Jane', 'Doe', '+12345678902', 'yaroslav.voznyuk.2003@gmail.com', 'password123', '1992-02-02', 'female'),
                                                                                                 ('Steve', 'Doe', '+12345678123', 'steve.doe@gmail.com', '$2a$10$r7iRQ5y4r83yoxj9lHnXu.r6I2HEMFSTE0uQoYruk/Oe/2nnAdprq', '2015-07-29', 'male'),
                                                                                                 ('Taras', 'Shevshenko', '+12345678444', 'taras.shevshenko@gmail.com', '$2a$10$r7iRQ5y4r83yoxj9lHnXu.r6I2HEMFSTE0uQoYruk/Oe/2nnAdprq', '2001-07-29', 'male'),
                                                                                                 ('Lesya', 'Ukrainka', '+12345678452', 'lesya.ukrainka@ukr.net', '$2a$10$r7iRQ5y4r83yoxj9lHnXu.r6I2HEMFSTE0uQoYruk/Oe/2nnAdprq', '2000-07-29', 'female');

INSERT INTO accounts (created_at, is_active, user_id) VALUES
                                                          ('2023-01-01', true, 1),
                                                          ('2023-02-01', true, 2);

-- INSERT INTO password_reset_tokens (token, user_id, expiry_date) VALUES
--                                                                     ('00017f08-27df-4c37-9999-e1db8a477c11', 1, '2023-02-01'),
--                                                                     ('another-token-value', 2, '2023-03-01');

