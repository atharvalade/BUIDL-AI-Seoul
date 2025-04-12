# EventRegistry API Documentation Guide

## Overview
This guide provides information on using the EventRegistry API to fetch news articles based on various search criteria including keywords, concepts, and sources.

## Authentication
- **API Key**: `b379ca7a-9d5c-45ab-8f5a-e561c7f06597`
- **API Endpoint**: `https://eventregistry.org/api/v1/article/getArticles`

## Basic Request Format
```python
import requests
import json

url = "https://eventregistry.org/api/v1/article/getArticles"
headers = {"Content-Type": "application/json"}
payload = {
    "action": "getArticles",
    "apiKey": "b379ca7a-9d5c-45ab-8f5a-e561c7f06597",
    # Additional parameters here
}

response = requests.post(url, headers=headers, json=payload)
```

## Common Parameters

### Authentication Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | string | Your API key for authentication |

### Search Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `keyword` | string/array | Keywords or phrases to search for |
| `keywordOper` | string | Boolean operator for multiple keywords ('and'/'or') |
| `keywordLoc` | string | Where to search for keywords ('body', 'title', 'body,title') |
| `conceptUri` | string/array | Wikipedia URIs of concepts to search for |
| `conceptOper` | string | Boolean operator for multiple concepts ('and'/'or') |
| `sourceUri` | string/array | URIs of news sources to include |
| `sourceLocationUri` | string/array | Locations of news sources |
| `sourceGroupUri` | string/array | Groups of news sources |
| `categoryUri` | string/array | Categories to filter by |
| `lang` | string/array | Language codes (e.g., 'eng' for English) |

### Date Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `dateStart` | string | Start date in YYYY-MM-DD format |
| `dateEnd` | string | End date in YYYY-MM-DD format |
| `forceMaxDataTimeWindow` | integer | Max age of content in days (7 or 31) |

### Source Ranking Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `startSourceRankPercentile` | integer | Starting percentile (0-90) of sources to include |
| `endSourceRankPercentile` | integer | Ending percentile (10-100) of sources to include |

### Pagination Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `articlesPage` | integer | Page number (starting from 1) |
| `articlesCount` | integer | Number of articles per page (max 100) |
| `articlesSortBy` | string | How to sort ('date', 'rel', 'sourceImportance', etc.) |
| `articlesSortByAsc` | boolean | Sort ascending (true) or descending (false) |

### Response Content Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `articleBodyLen` | integer | Length of article body (-1 for full) |
| `resultType` | string | Type of results ('articles', 'uriWgtList', etc.) |
| `dataType` | array | Content types to include ('news', 'pr', 'blog') |
| `includeArticleTitle` | boolean | Include article titles in response |
| `includeArticleBody` | boolean | Include article bodies in response |
| `includeArticleConcepts` | boolean | Include article concepts in response |
| `includeArticleCategories` | boolean | Include article categories in response |

## Example: Search for Trump's China Tariffs
```python
payload = {
    "action": "getArticles",
    "keyword": ["Trump", "tariffs", "China"],
    "keywordOper": "and",
    "keywordLoc": "title",
    "conceptUri": [
        "http://en.wikipedia.org/wiki/Donald_Trump",
        "http://en.wikipedia.org/wiki/China",
        "http://en.wikipedia.org/wiki/Tariff"
    ],
    "conceptOper": "and",
    "dateStart": "2023-10-01",
    "dateEnd": "2023-10-31",
    "articlesPage": 1,
    "articlesCount": 100,
    "articlesSortBy": "date",
    "articlesSortByAsc": False,
    "articleBodyLen": -1,
    "resultType": "articles",
    "dataType": ["news", "pr"],
    "lang": "eng",
    "startSourceRankPercentile": 0,
    "endSourceRankPercentile": 10,
    "apiKey": "b379ca7a-9d5c-45ab-8f5a-e561c7f06597"
}
```

## Negative Search Parameters
Add these parameters to exclude certain content:

| Parameter | Type | Description |
|-----------|------|-------------|
| `ignoreKeyword` | string/array | Keywords to exclude |
| `ignoreConceptUri` | string/array | Concepts to exclude |
| `ignoreCategoryUri` | string/array | Categories to exclude |
| `ignoreSourceUri` | string/array | Sources to exclude |

## Usage Tips
1. Use `keywordOper: "and"` to require all keywords to be present
2. Use `conceptOper: "and"` to require all concepts to be present
3. Use `startSourceRankPercentile` and `endSourceRankPercentile` to filter by source quality
4. Use `forceMaxDataTimeWindow: 31` to limit to last month (saves API quota)
5. Max 100 articles can be retrieved per request; use `articlesPage` for pagination

## Error Handling
Check the response status code and handle errors appropriately:
```python
if response.status_code == 200:
    data = response.json()
else:
    print(f"Error: {response.status_code}")
    print(response.text)
```

## Further Information
For complete API documentation, visit: https://eventregistry.org/documentation 