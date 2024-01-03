CREATE TYPE "type" AS ENUM (
  'video',
  'p5',
  'hydra',
  'threejs'
);

CREATE TABLE "sources" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "room" int NOT NULL,
  "type" type NOT NULL,
  "data" text
);