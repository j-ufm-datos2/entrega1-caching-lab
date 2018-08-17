# Entrega 1 

## Implementacion de Cache

**Equipo:**

- [Juan Luis Lopez](https://github.com/juanluislopez24)
- [Juan Roberto Alvarado](https://github.com/Juanroalvarado)


###Instrucciones de Uso

**Requerimientos**

[Docker Community Edition](https://www.docker.com/community-edition)

Utilizar Linux o OSX debido a la configuracion de storage.

**Instrucciones**

Primero clonar el repositorio y cd hacia el

Para levantar el conteneder que incluye node, redis y el TICK stack.

```
docker-compose up
```

Deberia de loggear un mensaje de servidor arriba en el 3000

### Requests

Para probar hacer un request

```
curl http://localhost:3000/api/search?query={query}
```

Remplazando {query} con su palabra clave.

### Visualizacion de los requests
Podemos obserar que los tiempos de respuesta son de magnitudes mayores cuando se busca a el api que cuando se busca en el cache.

El uso de CPU tiene picos durante las busquedas a el api y escrituras a el redis.

![visualizacion](https://raw.githubusercontent.com/j-ufm-datos2/entrega1-caching-lab/master/project%20description/dashboard.png)

### Respuestas de JMeter

Realizando 2 consultas a el API y multiples consultas a el cache. Podemos observar la velocidad del cache comparado a las requests del API.

![jmeter](https://raw.githubusercontent.com/j-ufm-datos2/entrega1-caching-lab/master/project%20description/resultadosJmeter.png)


**Diagrama de Arquitectura**

![diagrama-aquitectura](https://raw.githubusercontent.com/j-ufm-datos2/entrega1-caching-lab/master/project%20description/Diagrama%20de%20arquitectura.png)

**Estructuras de datos**

Influx JSON Structure:

```javascript
{
  measurement: 'response_times',
  tags: { host: 'api' },
  fields: {
    response_time: result.response_time,
    source: result.source,
    query: result.query,
    raw: JSON.stringify(result.items)
  }
}
```

API Request:

```
curl http://localhost:3000/api/search?query={query}
```

Response Example:

```
{"response_time":1296,
  "query":"python",
  "source":"Github API"
  "total_count": 40,
  "incomplete_results": false,
  "items": [
    {
      "id": 3081286,
      "node_id": "MDEwOlJlcG9zaXRvcnkzMDgxMjg2",
      "name": "Tetris",
      "full_name": "dtrupenn/Tetris",
      "owner": {
        "login": "dtrupenn",
        "id": 872147,
        "node_id": "MDQ6VXNlcjg3MjE0Nw==",
        "avatar_url": "https://secure.gravatar.com/avatar/e7956084e75f239de85d3a31bc172ace?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png",
        "gravatar_id": "",
        "url": "https://api.github.com/users/dtrupenn",
        "received_events_url": "https://api.github.com/users/dtrupenn/received_events",
        "type": "User"
      },
      "private": false,
      "html_url": "https://github.com/dtrupenn/Tetris",
      "description": "A C implementation of Tetris using Pennsim through LC4",
      "fork": false,
      "url": "https://api.github.com/repos/dtrupenn/Tetris",
      "created_at": "2012-01-01T00:31:50Z",
      "updated_at": "2013-01-05T17:58:47Z",
      "pushed_at": "2012-01-01T00:37:02Z",
      "homepage": "",
      "size": 524,
      "stargazers_count": 1,
      "watchers_count": 1,
      "language": "Assembly",
      "forks_count": 0,
      "open_issues_count": 0,
      "master_branch": "master",
      "default_branch": "master",
      "score": 10.309712
    }
  ]
}
```
