CREATE TYPE "type" AS ENUM (
  'video',
  'p5',
  'hydra',
  'threejs'
);

CREATE TYPE "blend" AS ENUM (
  'sourceOver',
  'screen',
  'multiply',
  'difference'
);

CREATE TABLE "sources" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "date_created" timestamp NOT NULL DEFAULT (now()),
  "date_modified" timestamp NOT NULL DEFAULT (now()),
  "room" bigint NOT NULL,
  "type" type NOT NULL,
  "data" text,
  "alpha" decimal NOT NULL DEFAULT 1,
  "active" boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE "mixers" (
  "room" bigint PRIMARY KEY NOT NULL,
  "date_created" timestamp NOT NULL DEFAULT (now()),
  "date_modified" timestamp NOT NULL DEFAULT (now()),
  "blend" blend,
  "invert" boolean
);