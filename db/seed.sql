create table users (
    user_id serial primary key,
    email varChar(200) not null,
    password varChar(250) not null,
    username varChar(25) not null,
    country varChar(100),
    region varchar(100),
    profile_img text
);

create table bike (
    bike_id serial primary key,
    user_id int references users(user_id) on delete cascade,
    post_date TIMESTAMP,
    title varChar(25),
    manufacturer varChar(50),
    frame varChar(50),
    fork varChar(50),
    wheelset varChar(50),
    tires varChar(50),
    headset varChar(50),
    stem varChar(50),
    handlebars varChar(50),
    saddle varChar(50),
    seatpost varChar(50),
    crankset varChar(50),
    cog varChar(50),
    chain varChar(50),
    pedals varChar(50)
);

create table bike_img (
    img_id serial primary key,
    bike_id int references bike(bike_id) on delete cascade,
    url varChar(200),
    post_date TIMESTAMP
);


create table classified (
    classified_id serial primary key,
    user_id int references users(user_id) on delete cascade,
    title varChar(50),
    price numeric,
    type varChar(10),
    post_date TIMESTAMP,
    description TEXT
);

create table classified_img (
    img_id serial primary key,
    classified_id int references classified(classified_id) on delete cascade,
    url varChar(200),
    post_date TIMESTAMP
);

alter table bike_img
add FOREIGN key (bike_id_fk)
REFERENCES bike(bike_id) on delete cascade;

create table comment (
    comment_id serial primary key,
    user_id int references users(user_id) on delete cascade,
    post_date TIMESTAMP,
    parent_type varchar(20),
    classified_id int references classified(classified_id) on delete cascade,
    bike_id int references bike(bike_id) on delete cascade,
    text varChar(500)
);

