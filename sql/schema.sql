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
  tvseriesId integer,
  tvgenreId integer,
  foreign key (tvseriesId) references TVseries (id) on delete cascade,
  foreign key (tvgenreId) references TVgenre (id) on delete cascade
);

CREATE TABLE IF NOT EXISTS TVseasons(
	id serial primary key,
	showName varchar(128) not null,
	seasonNum integer,
	releaseDate date,
	about text,
	photo varchar(128),
	seriesId integer,
	foreign key (seriesId) references TVseries(id) on delete cascade
);

CREATE TABLE IF NOT EXISTS episodes(
	id serial primary key,
	episodeName varchar(128) not null,
	epiNum integer,
	releaseDate date,
	about text,
	season integer,
	seriesId integer,
	foreign key (seriesId) references TVseries(id) on delete cascade
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
	seriesId integer,
	userId integer,
	status varchar(64),
	rating integer,
	foreign key (seriesId) references TVseries(id) on delete cascade,
	foreign key (userId) references users(id) on delete cascade
);

