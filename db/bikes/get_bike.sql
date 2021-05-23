select b.*, u.username from bike b
join users u on b.user_id = u.user_id
where bike_id = $1;