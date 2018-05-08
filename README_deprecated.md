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

Request type: GET

URL parameters:
* `:shop` -- shop alias from shop info (e.g. "dixy").

Query parameters:
* `name` -- filter items by name (optional)
* `category` -- filter items by category (optional)

Example:
`/api/shops/dixy?name=сок?category=Консервы, соусы`

Sample response (`/api/shops/dixy`):
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

Sample response (`/api/shops/dixy/info`):
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

### `/api/shoplist` (GET)
Get all shopping lists for authenticated user.

Request type: GET\
Query parameters (optional):
* `mode` - `preview` or `full`.

This is a **secured** endpoint, so that you need to obtain
a JWT token. Authentication is described in the section below.

Sample response (`/api/shoplist`):
```json
[
    {
        "id": 1,
        "name": "Еда"
    },
    {
        "id": 2,
        "name": "www"
    },
    {
        "id": 3,
        "name": "qqq"
    },
    {
        "id": 4,
        "name": "Напитки"
    }
]
```

Sample response (`/api/shoplist?mode=preview`):
```json
[
    {
        "id": 1,
        "name": "Еда",
        "items": [
            "Чай Вrooke Вond пакетики 100 пакетиков, 180 г",
            "Имбирь корень, 1 кг",
            "Вода минеральная Ессентуки №17; №4, 0,5 л",
            "Вода питьевая Святой источник газированная; негазированная, 1,5 л",
            "Курица фермерская для жарки от Оксаны Коржовой 1.6-2кг",
            "Компот Д из персиков, 580 мл"
        ],
        "customItems": [
            "Привет",
            "Кирилл",
            ":)",
            "Максим",
            "Здарова",
            "сок",
            "томат"
        ]
    },
    {
        "id": 4,
        "name": "Напитки",
        "items": [
            "Томаты Черри, 250 г",
            "Чай Вrooke Вond пакетики 100 пакетиков, 180 г",
            "Перец красный, 1 кг",
            "Вода питьевая Агуша детская, 330 мл",
            "Вода минеральная Ессентуки №17; №4, 0,5 л",
            "Вода питьевая Святой источник газированная; негазированная, 1,5 л",
            "Конфеты Raffaello с цельным миндальным орехом в кокосовой обсыпке 150г",
            "Курица фермерская для жарки от Оксаны Коржовой 1.6-2кг"
        ],
        "customItems": [
            "kjk",
            "lo"
        ]
    }
]
```

Sample response (`/api/shoplist?mode=full`):
```json
[
    {
        "id": 1,
        "name": "Еда",
        "items": [
            {
                "id": 2,
                "name": "Чай Вrooke Вond пакетики 100 пакетиков, 180 г",
                "category": "Кофе, чай",
                "oldPrice": 166.9,
                "newPrice": 99.99,
                "dateIn": "2018-03-30",
                "dateOut": "2018-03-30",
                "crawlDate": "2018-03-30",
                "condition": "-",
                "image": null,
                "imageUrl": "https://dixy.ru/upload/iblock/728/2000051199.jpg",
                "discount": "-40",
                "shopId": 1
            }
        ],
        "customItems": [
            {
                "id": 9,
                "name": "Кирилл",
                "shoplistId": 1,
                "matchingItems": [
                    {
                        "id": 54661,
                        "name": "Кирилл Куприянов",
                        "category": "Разработчики",
                        "oldPrice": null,
                        "newPrice": null,
                        "dateIn": "2018-03-31",
                        "dateOut": "2018-06-30",
                        "crawlDate": null,
                        "condition": null,
                        "image": null,
                        "imageUrl": "https://avatars1.githubusercontent.com/u/18150209?s=400&v=4",
                        "discount": null,
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
]
```

### `/api/shoplist` (POST)
Create a shopping list.

Body:
```json
{
  "name": "Name of a shopping list"
}
```

This is a **secured** endpoint, so that you need to obtain

Sample reponse:
```json
{
    "id": 5,
    "name": "Завтрак",
    "accountId": 2
}
```

### `/api/shoplist/:id (GET)`
Get shopping list by id.

URL parameters:
* `id` - id of a shopping list

Sample response (`/api/shoplist/1`):
```json
{
    "id": 1,
    "name": "Еда",
    "items": [
        {
            "id": 73838,
            "name": "Компот Д из персиков, 580 мл",
            "category": "Консервы, соусы",
            "oldPrice": 137,
            "newPrice": 99.99,
            "dateIn": "2018-04-02",
            "dateOut": "2018-04-08",
            "crawlDate": "2018-04-02",
            "condition": "-",
            "image": null,
            "imageUrl": "https://dixy.ru/upload/iblock/fe2/2000183687.jpg",
            "discount": "-27",
            "shop": {
                "id": 1,
                "alias": "dixy",
                "name": "Дикси"
            }
        }
  ],
     "matchingItems": [
        {
            "id": 155,
            "name": "Напиток сокосодержащий Любимый земляничное лето; яблоко-вишня-черешня; апельсин-манго-мандарин, 0,95 л",
            "category": "Напитки",
            "oldPrice": 66.7,
            "newPrice": 39.99,
            "dateIn": "2018-03-26",
            "dateOut": "2018-04-08",
            "crawlDate": "2018-03-30",
            "condition": "-",
            "image": null,
            "imageUrl": "https://dixy.ru/upload/iblock/65e/2000159266.jpg",
            "discount": "-40",
            "shopId": 1,
            "shop": {
                "id": 1,
                "alias": "dixy",
                "name": "Дикси"
            }
        }
    ]
}
```

### `/api/shoplist/:id (DELETE)`
Delete a shopping list with a given id.

### `/api/shoplist/:id/additem`
Add an item to shopping list for authenticated user.

Request type: POST\
Query parameters:
* `id` -- id of an item, which will be added to shopping list.
* `custom` -- custom item name, which will be added to shopping list.

Examples:\
`/api/shoplist/1/add?id=737`\
`/api/shoplist/1/add?custom=вода`

This is a **secured** endpoint, so that you need to obtain
a JWT token. See Authentication section. 

Sample response:
* Status: 200 'OK' if an item was successfully added to shopping list
* Status: 404 'No such item' if there is no such item in a database

### `/api/shoplist/:id/deleteitem`
Delete an item from shopping list for authenticated user.

Request type: DELETE\
Query parameters:
* `id` -- id of an item, which will be removed to shopping list.
* `customid` -- id of custom item, which will be removed to shopping list.

Examples:\
`/api/shoplist/1/delete?id=737`\
`/api/shoplist/1/delete?customid=57`

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
