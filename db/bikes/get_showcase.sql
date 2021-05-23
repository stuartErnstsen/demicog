select * from bike
where bike_id in ($1, $2);