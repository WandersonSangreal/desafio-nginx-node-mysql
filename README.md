# Desafio nginx, node e mysql

Cadastro e consulta de usuários com node usando mysql como banco e nginx como proxy.

### Tabela com usuáro teste:

---

| ID  | Name               |
| ---:| ------------------ |
| 1   | Usuário Teste      |

### Endpoins:

---

Retorna todas as pessoas

```
curl --location --request GET 'http://127.0.0.1:8080/people' \
--header 'Content-Type: application/json'
```

Retorna pessoa especificada pelo ID

```
curl --location --request GET 'http://127.0.0.1:8080/people\1' \
--header 'Content-Type: application/json'
```

Cadastra uma nova pessoa e retorna essa pessoa

```
curl --location --request POST 'http://127.0.0.1:8080/people' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Nova Pessoa"
}'
```

Edita o nome de uma pessoa e retorna essa pessoa

```
curl --location --request PUT 'http://127.0.0.1:8080/people/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Pessoa Alterada"
}'
```

Remove uma pessoa especificada pelo ID e retorna o ID

```
curl --location --request DELETE 'http://127.0.0.1:8080/people/1'
```