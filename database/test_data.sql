INSERT INTO Users (username, email, password) VALUES
    ('ivanov_a',  'ivanov@mail.ru',    'hash_001'),
    ('petrova_n', 'petrova@gmail.com', 'hash_002'),
    ('sidorov_k', 'sidorov@yandex.ru', 'hash_003'),
    ('kozlov_m',  'kozlov@mail.ru',    'hash_004');

INSERT INTO track (title, artist, duration) VALUES
    ('Bohemian Rhapsody', 'Queen', 354),
    ('Smells Like Teen Spirit', 'Nirvana', 301),
    ('Hotel California', 'Eagles', 391),
    ('Stairway to Heaven', 'Led Zeppelin', 482),
    ('Imagine', 'John Lennon', 187),
    ('Creep', 'Radiohead', 239),
    ('Lose Yourself', 'Eminem', 326),
    ('Rolling in the Deep', 'Adele', 228),
    ('Billie Jean', 'Michael Jackson', 294),
	('MONROE TEARS', 'Kai Angel', 205),
    ('Comfortably Numb', 'Pink Floyd', 382);

INSERT INTO playlist (name, user_id, created_at) VALUES
    ('Мои любимые', 1, '2024-01-15'),
    ('Рок классика', 2, '2024-02-20'),
    ('Вечерний отдых', 3, '2024-03-01'),
    ('Утренний заряд', 1, '2024-03-10'),
    ('Без настроения', 4, '2024-04-05');

INSERT INTO playlist_track (playlist_id, track_id) VALUES
    (1,1),(1,3),(1,5),
    (2,2),(2,4),(2,10),
    (3,6),(3,7),(3,8),
    (4,9),(4,1),
    (5,2),(5,6);

INSERT INTO history (user_id, track_id, played_at) VALUES
    (1, 2, '2024-03-15 18:00:00'),
    (1, 4, '2024-03-15 18:05:00'),
    (2, 1, '2024-03-16 09:00:00'),
    (3, 3, '2024-03-16 10:30:00'),
    (4, 5, '2024-03-17 15:00:00'),
    (1, 6, '2024-03-18 20:00:00'),
    (2, 7, '2024-03-19 11:00:00'),
    (3, 8, '2024-03-20 14:00:00');