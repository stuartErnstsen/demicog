select * from users
where LOWER(email) = LOWER($1) or LOWER(username) = LOWER($1);
