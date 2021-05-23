select c.*, u.username from classified c
join users u on c.user_id = u.user_id
where classified_id = $1;