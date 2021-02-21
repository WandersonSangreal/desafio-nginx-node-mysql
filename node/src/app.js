const express = require('express');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb',
}
const mysql = require('mysql');

const execute = (query, value) => {

    return new Promise((resolve, reject) => {

        const connection = mysql.createConnection(config);

        connection.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };

        connection.query(query, value, function (error, results, fields) {

            if (error) {
                connection.end();
                reject(error);
                return;
            }

            connection.end();
            resolve(results);

        });

    });

};

const people = {
    fetchAll: () => {

        return execute("SELECT * FROM people;", null);

    },
    fetch: (id) => {

        return execute("SELECT * FROM people WHERE id = :id ;", { id: parseInt(id, 10) });

    },
    create: ({ name }) => {

        const value = { name: name };

        return execute("INSERT INTO people (name) VALUES (:name);", value);

    },
    update: (id, { name }) => {

        const value = { id: id, name: name };

        return execute("UPDATE people SET name = :name WHERE id = :id;", value);

    },
    delete: (id) => {

        const value = { id: id };

        return execute("DELETE FROM people WHERE id = :id;", value);

    }
};

app.use(express.json());

app.get('/', (request, response) => {

    response.redirect('/people');

});

app.route('/people/:id?')
    .get(function (request, response) {

        const id = request.params.id;

        if (id) {

            people.fetch(id).then(results => {
                const [user] = results;
                if (user) {
                    response.status(200).json(user);
                } else {
                    response.status(404).json({ status: 404, description: 'Página não encontrada!' });
                }
            }).catch(reason => {
                response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                throw reason;
            });

            return;

        }

        people.fetchAll().then(results => {
            response.status(200).json(results);
        }).catch(reason => {
            response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
            throw reason;
        });

    })
    .post(function (request, response) {

        const param = request.body;

        if (param) {

            people.create(param).then(results => {
                if (results.affectedRows === 1) {
                    response.status(201).json({ id: results.insertId, name: param.name });
                } else {
                    response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                }
            }).catch(reason => {
                response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                throw reason;
            });

        } else {

            response.status(204).json({ status: 204, description: 'Nenhum conteúdo encontrado!' });

        }

    })
    .put(function (request, response) {

        const param = request.body;
        const id = request.params.id;

        if (param && id) {

            people.update(id, param).then(results => {
                if (results.affectedRows === 1) {
                    response.status(201).json({ id: id, name: param.name });
                } else {
                    response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                }
            }).catch(reason => {
                response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                throw reason;
            });

        } else {

            response.status(204).send({ status: 204, description: 'Nenhum conteúdo encontrado!' });

        }

    })
    .delete(function (request, response) {

        const id = request.params.id;

        if (id) {

            people.delete(id).then(results => {
                if (results.affectedRows === 1) {
                    response.status(201).json({ id: id });
                } else {
                    response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                }
            }).catch(reason => {
                response.status(500).json({ status: 500, description: 'Ocorreu um erro inesperado!' });
                throw reason;
            });

        } else {

            response.status(204).json({ status: 500, description: 'Nenhum conteúdo encontrado!' });

        }

    });

app.listen(port, () => {
    console.log("Running");
});