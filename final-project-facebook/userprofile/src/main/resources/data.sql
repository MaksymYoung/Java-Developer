INSERT INTO userprofile (user_id, nickname, company, interests, country, state, city, address, apartment, postcode, linkedin, telegram, viber)
VALUES
    (1, 'john_doe', 'Tech Corp', 'Reading, Hiking', 'USA', 'California', 'San Francisco', '1234 Elm Street', 'Apt 1', '94107', 'linkedin.com/in/johndoe', '@johndoe', '123-456-7890'),
    (2, 'jane_smith', 'Finance Inc', 'Traveling, Cooking', 'Canada', 'Ontario', 'Toronto', '5678 Maple Ave', 'Apt 2', 'M5V2T6', 'linkedin.com/in/janesmith', '@janesmith', '098-765-4321');

-- Вставка зображень для користувачів у таблицю userprofile_images
INSERT INTO userprofile_images (userprofile_id, image)
VALUES
    (1, 'image1.jpg'),
    (1, 'image2.jpg'),
    (2, 'image3.jpg');
