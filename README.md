# Server part for EasySales app

## Sales manipulations

### `/api/shops` 
Get info on available shops.

Request type: GET

Sample response:
```json
[
    {
        "id": 1,
        "alias": "dixy",
        "name": "Дикси"
    },
    {
        "id": 2,
        "alias": "perekrestok",
        "name": "Перекресток"
    }
]
```

### `/api/shops/:shop` 
Get current shop sales.

Request type: GET\
URL parameters:
* `:shop` -- shop alias from shop info (e.g. "dixy").

Examples:\
`/api/shops/dixy`

Sample response:
```json
[
    {
        "id": 565,
        "name": "Мороженое Жемчужина России эскимо миндаль-карамель, 80 г",
        "category": "Кулинария, заморозка, мороженое",
        "oldPrice": 52.9,
        "newPrice": 26.45,
        "dateIn": "2018-03-15",
        "dateOut": "2018-03-28",
        "crawlDate": "2018-03-17",
        "condition": "-",
        "image": null,
        "imageUrl": "https://dixy.ru/upload/iblock/814/2000148579.jpg",
        "discount": "1+1",
        "shopId": 1
    }
]
``` 

### `/api/shops/:shop/info`
Get info on current shop. (I.e. categories, number of items).

Request type: GET\
URL parameters:
* `:shop` -- shop alias from shop info (e.g. "dixy").

Examples:
`/api/shops/dixy/info`

Sample response:
```json
{
    "itemsPerPage": 30,
    "shop": {
        "id": 1,
        "alias": "dixy",
        "name": "Дикси"
    },
    "itemCount": 62,
    "numPages": 3,
    "categories": [
        "Кулинария, заморозка, мороженое",
        "Кондитерские изделия",
        "Хлеб, торты",
        "Консервы, соусы",
        "Напитки",
        "Овощи и фрукты",
        "Мясо, яйцо",
        "Молочная гастрономия",
        "Крупы, завтраки, специи",
        "Мясная гастрономия",
        "Кофе, чай",
        "Непродовольственные товары"
    ]
}
```

## Shopping list manipulations

### `/api/shoplist`
Get shopping list for authenticated user.

Request type: GET

This is a **secured** endpoint, so that you need to obtain
a JWT token. Authentication is described in the section below.

Sample response:
```json
{
    "id": 1,
    "username": "root",
    "items": [
        {
            "id": 606,
            "name": "Кукуруза сладкая Globus, 400 г/425 мл",
            "category": "Консервы, соусы",
            "oldPrice": 53.4,
            "newPrice": 39.99,
            "dateIn": "2018-03-15",
            "dateOut": "2018-03-28",
            "crawlDate": "2018-03-17",
            "condition": "-",
            "image": null,
            "imageUrl": "https://dixy.ru/upload/iblock/efd/1041027555.jpg",
            "discount": "-25",
            "shop": {
                "id": 1,
                "alias": "dixy",
                "name": "Дикси"
            }
        }
    ],
    "customItems": [
        {
            "id": 18,
            "item": "сок",
            "matchingItems": [
                {
                    "id": 737,
                    "name": "Нектар Сады Придонья яблоко-тыква с мякотью; яблоко-морковь; яблоко-алыча с мякотью; сок томатный, 1 л",
                    "category": "Напитки",
                    "oldPrice": 84.6,
                    "newPrice": 54.99,
                    "dateIn": "2018-03-15",
                    "dateOut": "2018-03-28",
                    "crawlDate": "2018-03-17",
                    "condition": "-",
                    "image": null,
                    "imageUrl": "https://dixy.ru/upload/iblock/26e/2000223786.jpg",
                    "discount": "-35",
                    "shopId": 1,
                    "shop": {
                        "id": 1,
                        "alias": "dixy",
                        "name": "Дикси"
                    }
                }               
            ]
        }
    ]
}
```

### `/api/shoplist/add`
Add an item to shopping list for authenticated user.

Request type: POST\
Query parameters:
* `id` -- id of an item, which will be added to shopping list.
* `custom` -- custom item name, which will be added to shopping list.

Examples:\
`/api/shoplist/add?id=737`\
`/api/shoplist/add?custom=вода`

This is a **secured** endpoint, so that you need to obtain
a JWT token. See Authentication section. 

Sample response:
* Status: 200 'OK' if an item was successfully added to shopping list
* Status: 404 'No such item' if there is no such item in a database

### `/api/shoplist/delete`
Delete an item from shopping list for authenticated user.

Request type: DELETE\
Query parameters:
* `id` -- id of an item, which will be removed to shopping list.
* `customid` -- id of custom item, which will be removed to shopping list.

Examples:\
`/api/shoplist/delete?id=737`\
`/api/shoplist/delete?customid=57`

This is a **secured** endpoint, so that you need to obtain
a JWT token. See Authentication section. 

## Authentication

To get a JWT token to access secured endpoints one needs to send a 
POST request to `/api/auth/login`.

Request type: POST

Sample request body:
```json
{
	"username": "root",
	"password": "root"
}
```

Sample response:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJyb290IiwiaWF0IjoxNTIxNDg5MDg0fQ.eyx6jxlIDkY7XVFBvitxFtoY55dqYQ2xbHVVPnJ046c
```
