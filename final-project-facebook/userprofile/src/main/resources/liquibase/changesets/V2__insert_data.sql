INSERT INTO userprofiles (
    user_id, nickname, company, interests, country,
    state, city, address, apartment, postcode,
    linkedin, telegram, viber, creation_date, last_modified_date
) VALUES
      (
          1, 'Dan', 'Company A', 'Interests A', 'Country A',
          'State A', 'City A', 'Address A', 'Apartment A', 'Postcode A',
          'linkedin.com/daniel', 't.me/daniel', '+1234567890', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ),
      (
          2, 'AnnaD', 'Company B', 'Interests B', 'Country B',
          'State B', 'City B', 'Address B', 'Apartment B', 'Postcode B',
          'linkedin.com/anna', 't.me/anna', '+0987654321', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      );
