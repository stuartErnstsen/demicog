insert into users (
    email,
    password, 
    username, 
    country, 
    region, 
    profile_img 
) values (
    ${email},
    ${hash},
    ${username},
    ${country},
    ${region},
    ${profileImg}
)
returning user_id, email, username, country, region, profile_img;