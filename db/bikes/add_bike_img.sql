insert into bike_img (
    bike_id,
    url,
    post_date
) values (
    ${bike_id},
    ${url},
    CURRENT_TIMESTAMP
);
