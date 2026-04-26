-- Сравнение
select * from track where duration > 300;

-- AND
select * from track
where duration > 200 AND artist = 'Queen';

-- OR
select * from track
where artist = 'Queen' OR duration < 200;

-- LIKE
select * from Users
where email LIKE '%@mail.ru';

-- ILIKE (регистронезависимо)
select * from track
where title ILIKE '%love%';

-- SIMILAR TO
select * from track
where title similar to '(B|C|I)%';

-- BETWEEN
select * from track
where duration BETWEEN 180 AND 300;

-- IN
select * from track
where artist IN ('Queen', 'Nirvana');