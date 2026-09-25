CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL UNIQUE,
    score INTEGER,
    num_syllables INTEGER,
    pronunciation TEXT
);

CREATE TABLE definitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    part_of_speech TEXT NOT NULL,
    definition TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE TABLE word_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    related_word_id INTEGER NOT NULL,
    relation_type TEXT NOT NULL,
    score INTEGER,
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (related_word_id) REFERENCES words(id),
    UNIQUE (word_id, related_word_id, relation_type)
);