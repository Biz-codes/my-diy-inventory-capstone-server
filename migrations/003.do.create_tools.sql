CREATE TABLE tools (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    tool_name VARCHAR(255) NOT NULL,
    details TEXT,
    quantity INTEGER
);

ALTER TABLE tools
    ADD COLUMN
        user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE NOT NULL;

INSERT INTO tools (supply_name, user_id, details, quantity)
    VALUES
        ('hammer', 2, 'small, yellow grip', 2),
        ('paintbrush', 2, 'large', 10),
        ('sandpaper', 2, 'fine', 5),
        ('sewing machine', 2, 'singer', 1);