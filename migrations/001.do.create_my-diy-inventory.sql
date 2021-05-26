CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE supplies (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    supply_name VARCHAR(255) NOT NULL,
    details TEXT,
    quantity INTEGER NOT NULL
);

CREATE TABLE tools (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    details TEXT,
    quantity INTEGER NOT NULL
);

CREATE TABLE projects (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    supplies_needed TEXT,
    tools_needed TEXT,
    instructions TEXT,
    delivery_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    done VARCHAR(255) NOT NULL
);