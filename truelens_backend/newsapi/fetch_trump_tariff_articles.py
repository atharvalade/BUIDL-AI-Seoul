import requests
import json
from datetime import datetime, timedelta

def fetch_trump_tariff_articles(api_key, days_back=31):
    """
    Fetch articles related to Trump's tariffs on China from EventRegistry API
    
    Args:
        api_key (str): Your EventRegistry API key
        days_back (int): Number of days to look back for articles
        
    Returns:
        dict: API response with articles
    """
    # Calculate date range (last N days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)
    
    # Format dates as required by API
    date_start = start_date.strftime("%Y-%m-%d")
    date_end = end_date.strftime("%Y-%m-%d")
    
    # API endpoint
    url = "https://eventregistry.org/api/v1/article/getArticles"
    
    # Request headers
    headers = {
        "Content-Type": "application/json"
    }
    
    # Request payload
    payload = {
        "action": "getArticles",
        "keyword": ["Trump", "tariffs", "China"],  # Individual keywords
        "keywordOper": "and",  # Require ALL keywords to be present
        "keywordLoc": "title",  # Search only in the title
        "conceptUri": [
            "http://en.wikipedia.org/wiki/Donald_Trump",
            "http://en.wikipedia.org/wiki/China",
            "http://en.wikipedia.org/wiki/Tariff"
        ],
        "conceptOper": "and",
        "dateStart": date_start,
        "dateEnd": date_end,
        "articlesPage": 1,
        "articlesCount": 100,
        "articlesSortBy": "date",
        "articlesSortByAsc": False,
        "articleBodyLen": -1,  # Full article body
        "resultType": "articles",
        "dataType": ["news", "pr"],
        "forceMaxDataTimeWindow": 31,
        "lang": "eng",
        "startSourceRankPercentile": 0,  # Start from the top sources
        "endSourceRankPercentile": 10,   # Only include top 10% sources
        "apiKey": api_key
    }
    
    # Make the API request
    response = requests.post(url, headers=headers, json=payload)
    
    # Check if request was successful
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

def save_articles_to_file(articles, filename="trump_tariff_articles.json"):
    """
    Save articles to a JSON file
    
    Args:
        articles (dict): API response containing articles
        filename (str): Output filename
    """
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4, ensure_ascii=False)
    print(f"Articles saved to {filename}")

def display_article_summaries(articles_data):
    """
    Display a summary of the articles fetched
    
    Args:
        articles_data (dict): API response containing articles
    """
    if not articles_data or "articles" not in articles_data or "results" not in articles_data["articles"]:
        print("No articles found or invalid response format")
        return
    
    articles = articles_data["articles"]["results"]
    print(f"\nFound {len(articles)} articles about Trump's tariffs on China from top 10% sources:\n")
    
    for i, article in enumerate(articles, 1):
        title = article.get("title", "No title")
        source = article.get("source", {}).get("title", "Unknown source")
        date = article.get("date", "Unknown date")
        
        print(f"{i}. {title}")
        print(f"   Source: {source}")
        print(f"   Date: {date}")
        print()

if __name__ == "__main__":
    # Use the provided API key
    API_KEY = "b379ca7a-9d5c-45ab-8f5a-e561c7f06597"
    
    print("Fetching articles about Trump's tariffs on China from top 10% sources...")
    articles_data = fetch_trump_tariff_articles(API_KEY)
    
    if articles_data:
        # Display article summaries
        display_article_summaries(articles_data)
        
        # Save complete results to file
        save_articles_to_file(articles_data)
        
        print("\nTo use a different API key or customize search parameters, edit this script.")
    else:
        print("Failed to fetch articles. Please check your API key and try again.") 