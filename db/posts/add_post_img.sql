insert into classified_img (
    classified_id,
    url,
    post_date
) values (
    ${classified_id},
    ${url},
    CURRENT_TIMESTAMP
);
