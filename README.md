# raiu

Easily create commands to return formatted messages for in-game ranks/records, to be used on various streaming platforms.

## Endpoints

```http
GET /rest/valorant/v1/rank/:region/:name/:tag?style=string&format=string
Content-Type: application/json
```
```json
{
  "message": "string",
}
```

```http
GET /rest/valorant/v1/record/:region/:name/:tag?format=string
Content-Type: application/json
```
```json
{
  "message": "string",
}
```
