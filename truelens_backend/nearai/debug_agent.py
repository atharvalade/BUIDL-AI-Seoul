# Commenting out the nearai import
# from nearai.agents.environment import Environment
import json
import requests
import time
from datetime import datetime, timedelta
import hashlib
from typing import List, Dict, Any, TypeVar
import re

# Define Environment type for type hints
Environment = TypeVar('Environment')

# Mock environment for debugging
class MockEnvironment:
    def __init__(self):
        self.logs = []
        self.replies = []
        self.env_vars = {"EVENT_REGISTRY_API_KEY": "b379ca7a-9d5c-45ab-8f5a-e561c7f06597"}
        self.files = {"cache.json": json.dumps({"articles": {}})}
    
    def add_system_log(self, message):
        print(f"SYSTEM LOG: {message}")
        self.logs.append(message)
    
    def add_reply(self, message):
        print(f"REPLY: {message}")
        self.replies.append(message)
    
    def request_user_input(self):
        print("Requesting user input...")
    
    def read_file(self, filename):
        if filename in self.files:
            return self.files[filename]
        raise FileNotFoundError(f"File {filename} not found")
    
    def write_file(self, filename, content):
        self.files[filename] = content
        print(f"File written: {filename}")
    
    def completion(self, messages):
        # Mock the AI completion for debugging
        prompt_content = messages[-1]["content"] if isinstance(messages[-1], dict) and "content" in messages[-1] else ""
        
        # If grouping articles
        if "Group these news articles by similarity" in prompt_content:
            print("Mocking article grouping response...")
            return "[[0, 1], [2, 3]]"  # Return a mock grouping of 2 pairs
        
        # If processing article group
        if "Create a comprehensive summary" in prompt_content:
            print("Mocking article processing response...")
            return """
            {
              "summary": "Sample summary of the news articles.",
              "sentiment": "positive",
              "sentiment_explanation": "The articles present positive economic outlook.",
              "trading_recommendations": {
                "buy": [{"symbol": "AAPL", "reason": "Strong growth indicators"}],
                "sell": [{"symbol": "XYZ", "reason": "Potential downturn"}]
              },
              "sources": ["Source1", "Source2"]
            }
            """
        
        return "Default mock response"

# Sample article data for testing
def get_sample_articles():
    return [
        {
            "uri": "article1",
            "title": "Trump's ongoing 25% auto tariffs expected to cut sales by millions",
            "body": "DETROIT -- As President Donald Trump's 25% tariffs on imported vehicles remain in effect despite a pullback this week on other country-based levies, analysts are expecting massive global implications for the automotive industry due to the policies.",
            "source": {"title": "CNBC"}
        },
        {
            "uri": "article2",
            "title": "US tariffs on imported vehicles affecting auto industry",
            "body": "Analysts expect significant impact on global automotive sales due to the US administration's 25% tariffs on imported vehicles continuing despite other tariff reductions.",
            "source": {"title": "Reuters"}
        },
        {
            "uri": "article3",
            "title": "Niagara County seeking extension of 'Medicaid penny'",
            "body": "Niagara County's so-called \"Medicaid penny\" -- a 1% additional sales tax imposed more than two decades ago to help defray costs of the low-income health insurance program -- may be extended for another two-year period through Nov. 30, 2027.",
            "source": {"title": "Yahoo"}
        },
        {
            "uri": "article4",
            "title": "New York county looks to extend Medicaid tax",
            "body": "Local officials in Niagara County are seeking to extend the 1% sales tax that funds Medicaid services in the region, which has been in place since 2003.",
            "source": {"title": "Local News"}
        },
    ]

def debug_run():
    """Run the agent with debugging to understand data flow"""
    env = MockEnvironment()
    print("=== Starting Debug Run ===")
    
    # Get cache
    try:
        cache_content = env.read_file("cache.json")
        cache = json.loads(cache_content)
        print(f"Cache loaded: {cache}")
    except:
        cache = {"articles": {}}
        print("Created new cache")
    
    # Mock getting the articles
    articles = get_sample_articles()
    print(f"Fetched {len(articles)} articles")
    
    # Filter out already processed articles
    new_articles = filter_new_articles(articles, cache)
    print(f"After filtering: {len(new_articles)} new articles")
    
    # Group similar articles
    article_groups = group_similar_articles(env, new_articles)
    print(f"Grouped into {len(article_groups)} groups")
    print(f"Group sizes: {[len(group) for group in article_groups]}")
    
    # Process each group
    results = []
    for i, group in enumerate(article_groups):
        print(f"\nProcessing group {i+1} with {len(group)} articles:")
        for article in group:
            print(f"  - {article['title']} (Source: {article['source']['title']})")
        
        if len(group) >= 2:
            result = process_article_group(env, group)
            results.append(result)
            print(f"  Result: {json.dumps(result, indent=2)[:100]}...")
            
            # Add processed articles to cache
            for article in group:
                cache_article(article, cache)
                print(f"  Cached article: {article['title']}")
        else:
            print(f"  Skipped group {i+1} because it has fewer than 2 articles")
    
    # Save the updated cache
    env.write_file("cache.json", json.dumps(cache, indent=2))
    
    # Check results
    if results:
        print(f"\nProcessed {len(results)} article groups")
    else:
        print("\nNo article groups with multiple sources found")
    
    print("=== Debug Run Complete ===")

# Use the same functions from the original agent
def load_cache(env: Environment) -> Dict:
    """Load the cache from a file or initialize a new one."""
    try:
        cache_content = env.read_file("cache.json")
        return json.loads(cache_content)
    except:
        env.add_system_log("Cache file not found. Creating a new cache.")
        return {"articles": {}}

def save_cache(env: Environment, cache: Dict):
    """Save the cache to a file."""
    env.write_file("cache.json", json.dumps(cache, indent=2))

def cache_article(article: Dict, cache: Dict):
    """Add an article to the cache with a unique identifier."""
    article_id = article.get("uri", "")
    if not article_id:
        # Generate a unique ID based on title and content
        title = article.get("title", "")
        content = article.get("body", "")
        article_id = hashlib.md5((title + content).encode()).hexdigest()
    
    cache["articles"][article_id] = {
        "title": article.get("title", ""),
        "date_processed": datetime.utcnow().isoformat(),
        "summary": article.get("summary", "")
    }

def filter_new_articles(articles: List[Dict], cache: Dict) -> List[Dict]:
    """Filter out articles that have already been processed."""
    new_articles = []
    
    for article in articles:
        article_id = article.get("uri", "")
        if not article_id:
            # Generate a unique ID based on title and content
            title = article.get("title", "")
            content = article.get("body", "")
            article_id = hashlib.md5((title + content).encode()).hexdigest()
        
        # Check if the article is in the cache
        if article_id not in cache["articles"]:
            new_articles.append(article)
    
    return new_articles

def group_similar_articles(env: Environment, articles: List[Dict]) -> List[List[Dict]]:
    """Group similar articles together based on their content."""
    env.add_system_log("Grouping similar articles")
    
    if not articles:
        return []
    
    # Using AI to group similar articles
    article_titles = [article.get("title", "") for article in articles]
    article_bodies = [article.get("body", "")[:500] for article in articles]  # Use first 500 chars of body for comparison
    
    # Prepare data for grouping
    grouping_data = []
    for i, (title, body) in enumerate(zip(article_titles, article_bodies)):
        grouping_data.append({
            "id": i,
            "title": title,
            "snippet": body
        })
    
    # Use AI to group similar articles
    prompt = {
        "role": "system", 
        "content": """
        You are an expert news analyst. Your task is to identify similar news articles that cover the same event or topic.
        Group the articles by their semantic similarity, focusing on the central news event rather than minor details.
        
        Example similar articles:
        - "Trump places 30% tariffs on China" and "USA placed 30% tariffs on China" (Same event)
        - "Facebook announces new AI features" and "Meta unveils artificial intelligence updates" (Same event)
        
        Return your response as a JSON array where each element is an array of article IDs that belong to the same group.
        Only group articles that are truly about the same specific news event. Articles that are merely on the same general topic but about different events should be in separate groups.
        """
    }
    
    # Convert grouping_data to a well-formatted string for the AI prompt
    articles_formatted = json.dumps(grouping_data, indent=2)
    
    user_prompt = f"""
    Group these news articles by similarity (same event/topic):
    
    {articles_formatted}
    
    Return ONLY a JSON array of arrays, where each inner array contains the IDs of similar articles.
    Example: [[0, 3, 7], [1, 5], [2], [4, 6, 8, 9]]
    """
    
    # Call the AI to group the articles
    result = env.completion([prompt, {"role": "user", "content": user_prompt}])
    
    try:
        # Extract JSON from the result
        json_result = re.search(r'\[\[.*\]\]', result, re.DOTALL)
        if json_result:
            groups_ids = json.loads(json_result.group(0))
            
            # Convert groups of IDs to groups of articles
            article_groups = []
            for group in groups_ids:
                article_group = [articles[idx] for idx in group if idx < len(articles)]
                if len(article_group) >= 2:  # Only include groups with at least 2 articles
                    article_groups.append(article_group)
            
            env.add_system_log(f"Found {len(article_groups)} groups of similar articles")
            return article_groups
        else:
            env.add_system_log("Could not extract groups from AI response")
            return [[article] for article in articles]  # Return each article as its own group
    except Exception as e:
        env.add_system_log(f"Error parsing AI grouping: {str(e)}")
        return [[article] for article in articles]  # Return each article as its own group

def process_article_group(env: Environment, article_group: List[Dict]) -> Dict:
    """
    Process a group of similar articles to create a comprehensive summary with sentiment and trading recommendations.
    """
    env.add_system_log(f"Processing a group of {len(article_group)} similar articles")
    
    # Prepare data for processing
    titles = [article.get("title", "") for article in article_group]
    bodies = [article.get("body", "") for article in article_group]
    sources = [article.get("source", {}).get("title", "Unknown") for article in article_group]
    
    # Combine titles and bodies for processing
    titles_text = "\n".join([f"{i+1}. {title}" for i, title in enumerate(titles)])
    bodies_text = "\n\n".join([f"SOURCE {i+1} ({source}):\n{body}" for i, (body, source) in enumerate(zip(bodies, sources))])
    
    # Use AI to create a summary, sentiment analysis, and trading recommendations
    prompt = {
        "role": "system", 
        "content": """
        You are a financial news analyst expert. Given multiple news articles on the same topic:
        
        1. Create a comprehensive, brief, and easy-to-understand summary that captures all key information.
        2. Analyze the sentiment of the news (positive, negative, or neutral).
        3. Provide specific trading recommendations, including:
           - Which specific stocks might benefit (BUY recommendation)
           - Which specific stocks might suffer (SELL recommendation)
           - Why these stocks would be affected
        
        Format your response as JSON with the following structure:
        {
          "summary": "Comprehensive summary...",
          "sentiment": "positive/negative/neutral",
          "sentiment_explanation": "Brief explanation of the sentiment...",
          "trading_recommendations": {
            "buy": [
              {"symbol": "TICKER", "reason": "Reason for buying"}
            ],
            "sell": [
              {"symbol": "TICKER", "reason": "Reason for selling"}
            ]
          },
          "sources": ["Source1", "Source2", ...]
        }
        """
    }
    
    user_prompt = f"""
    TITLES:
    {titles_text}
    
    ARTICLES:
    {bodies_text}
    
    Create a comprehensive summary, sentiment analysis, and trading recommendations based on these articles.
    Return ONLY a JSON object with the structure specified in the instructions.
    """
    
    # Call the AI to process the article group
    result = env.completion([prompt, {"role": "user", "content": user_prompt}])
    
    try:
        # Extract JSON from the result
        json_match = re.search(r'({.*})', result, re.DOTALL)
        if json_match:
            processed_result = json.loads(json_match.group(0))
            
            # Add original titles and sources
            processed_result["original_titles"] = titles
            processed_result["original_sources"] = sources
            
            return processed_result
        else:
            env.add_system_log("Could not extract JSON from AI response")
            # Create a default response
            return {
                "summary": "Failed to generate summary.",
                "sentiment": "neutral",
                "sentiment_explanation": "Could not determine sentiment.",
                "trading_recommendations": {"buy": [], "sell": []},
                "sources": sources,
                "original_titles": titles
            }
    except Exception as e:
        env.add_system_log(f"Error parsing AI processing result: {str(e)}")
        # Create a default response
        return {
            "summary": "Failed to generate summary due to error.",
            "sentiment": "neutral",
            "sentiment_explanation": "Could not determine sentiment due to error.",
            "trading_recommendations": {"buy": [], "sell": []},
            "sources": sources,
            "original_titles": titles
        }

# Run the debug session
if __name__ == "__main__":
    debug_run() 