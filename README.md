## GET requests

### `/api/shops` 
Get info on available shops.
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
Parameters:
* `:shop` -- shop alias from shop info (i.e. "dixy").
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
    },
	...
]
``` 

### `/api/shops/:shop/info`
 Get info on current shop. (I.e. categories, number of items).
 Parameters:
* `:shop` -- shop alias from shop info (i.e. "dixy").

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

