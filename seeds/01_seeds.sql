-- User seeds

INSERT INTO users (name, email, password)
VALUES ('Bob', 'bob@bob.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'something@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' );

INSERT INTO users (name, email, password)
VALUES ('Louisa Meyer', 'other@other.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');



-- Properties seeds

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES(1, 'Speed lamp', 'description', 'thumbphoto1.jpeg', 'coverphoto1.jpeg', 50, 1, 2, 3, 'Canada', '123 Fake Street', 'Montreal', 'Quebec', 'H1H 1H1', true ),
(2, 'Blank Corner', 'description', 'thumbphoto2.jpeg', 'coverphoto2.jpeg', 75, 1, 2, 2, 'Canada', '123 Rue Fausse', 'Trois-Rivieres', 'Quebec', 'B2B 2B2', true ),
(3, 'Habit Mix', 'description', 'thumbphoto3.jpeg', 'coverphoto3.jpeg', 100, 1, 2, 4, 'Canada', '321 West Street', 'Ottawa', 'Ontario', 'C3C 3C3', true );


--  Reservation seeds

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ( '2021-03-30', '2021-04-01', 1, 1),
('2020-03-30', '2020-04-01', 2, 2),
('2019-02-01', '2019-02-20', 3, 3);

-- Property review seeds

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 5, 'message1'),
(2, 2, 2, 3, 'message2'),
(3, 3, 3, 1, 'message3');

