const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db_config');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.end('api movie by : pradikaaaaa');
});

app.get('/api/movie', (req, res) => {
    let sql = "SELECT movie_id, title, vote_average, movie_status FROM movie ORDER BY popularity DESC LIMIT 10";
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results
        };

        res.send(JSON.stringify(data));
    });
});

app.get('/api/detail_movie/:id', (req, res) => {
    let sql = "SELECT * FROM movie WHERE movie_id=" + req.params.id + " ; ";
    sql += `SELECT g.genre_name FROM movie_genres mg
            INNER JOIN genre g
            ON mg.genre_id = g.genre_id
            WHERE mg.movie_id =` + req.params.id + ';';
    sql += `SELECT keyword.keyword_name FROM movie_keywords
            INNER JOIN keyword
            ON movie_keywords.keyword_id = keyword.keyword_id
            WHERE movie_keywords.movie_id =` + req.params.id;
    let query = db.query(sql, (err, results, fields) => {
        if (err) throw err;

        //add genre
        results[0][0].genres = results[1];
        //add keyword
        results[0][0].keyword = results[2];

        let data = {
            "status": 200,
            "message": "Success",
            "data": results[0]
        };

        res.send(JSON.stringify(data));
    });
});

app.get('/api/movie_cast/:id', (req, res) => {
    let sql = `SELECT movie_cast.character_name, person.person_name as actor_name FROM movie_cast
        INNER JOIN person
        ON movie_cast.person_id = person.person_id
        WHERE movie_cast.movie_id =` + req.params.id + `
        ORDER BY movie_cast.cast_order ASC`;

    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results
        };

        res.send(JSON.stringify(data));
    });
})

app.get('/api/movie_by_cast/:id_cast', (req, res) => {
    let sql = `SELECT movie.movie_id, movie.title FROM movie_cast
        INNER JOIN movie
        ON movie_cast.movie_id = movie.movie_id
        WHERE movie_cast.person_id =` + req.params.id_cast;

    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results
        };

        res.send(JSON.stringify(data));
    });
})

app.get('/api/movie_crew/:id_movie', (req, res) => {
    let sql = `SELECT person.person_name, department.department_name, movie_crew.job FROM movie_crew
        INNER JOIN person
        ON movie_crew.person_id = person.person_id
        INNER JOIN department
        ON movie_crew.department_id = department.department_id
        WHERE movie_crew.movie_id = ` + req.params.id_movie;

    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results
        };

        res.send(JSON.stringify(data));
    });
})

app.get('/api/genres', (req, res) => {
    let sql = "SELECT * FROM genre";
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results[0]
        };

        res.send(JSON.stringify(data));
    });
});

app.get('/api/movie_by_genre/:id_genre', (req, res) => {
    let sql = `SELECT genre.genre_name, movie.title FROM movie_genres
        INNER JOIN genre
        ON movie_genres.genre_id = genre.genre_id
        INNER JOIN movie
        ON movie_genres.movie_id = movie.movie_id
        WHERE genre.genre_id =` + req.params.id_genre;

    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        let data = {
            "status": 200,
            "message": "Success",
            "data": results
        };

        res.send(JSON.stringify(data));
    });
})

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});