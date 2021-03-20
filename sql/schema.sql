CREATE TABLE IF NOT EXISTS TVseries(
  id serial primary key,
  showName varchar(128) not null,
  releaseDate date,
  stillGoing boolean,
  tagline varchar(128),
  photo varchar(128),
  about text,
  language varchar(128),
  channel varchar(128),
  url varchar(128)
);

CREATE TABLE IF NOT EXISTS TVgenre(
  id serial primary key,
  typeName varchar(128) not null unique
);

CREATE TABLE IF NOT EXISTS TVconnect(
  id serial primary key,
  tvseries_id integer,
  tvgenre_id integer,
  foreign key (tvseries_id) references TVseries (id) on delete cascade,
  foreign key (tvgenre_id) references TVgenre (id) on delete cascade
);

CREATE TABLE IF NOT EXISTS TVseasons(
	id serial primary key,
	showName varchar(128) not null,
	season_num integer,
	releaseDate date,
	about text,
	photo varchar(128),
	series_id integer,
	foreign key (series_id) references TVseries(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS episodes(
	id serial primary key,
	episodeName varchar(128) not null,
	epi_num integer,
	releaseDate date,
	about text,
	season integer,
	series_id integer,
	foreign key (series_id) references TVseries(id)
);

CREATE TABLE IF NOT EXISTS users (
	id serial primary key,
	username varchar(32) not null unique,
	email varchar(64) not null unique,
    password varchar(64) not null,
	admin boolean default false 
);

CREATE TABLE IF NOT EXISTS userConnect (
	id serial primary key,
	series_id integer,
	user_id integer,
	status varchar(64),
	rating integer,
	foreign key (series_id) references TVseries(id) on delete cascade,
	foreign key (user_id) references users(id) on delete cascade
);

