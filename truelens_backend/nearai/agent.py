from nearai.agents.environment import Environment
import json
import requests
import time
from datetime import datetime, timedelta
import hashlib
from typing import List, Dict, Any
import re
import os

def run(env: Environment):
    """Run the NEAR AI agent."""
    env.add_system_log("Starting NEAR AI agent")
    
    # Get API key from environment variables
    api_key = env.env_vars.get("EVENT_REGISTRY_API_KEY", "b379ca7a-9d5c-45ab-8f5a-e561c7f06597")
    
    # Fetch and process articles
    articles, pre_grouped, remaining = fetch_articles(env, api_key)
    
    # Debug log the number of articles
    env.add_system_log(f"Processing {len(articles)} articles, with {len(pre_grouped)} pre-grouped sets")
    
    if not articles:
        env.add_reply("No new articles found.")
        env.request_user_input()
        return
    
    # Load already processed articles
    processed_file_path = "processed_articles.json"
    
    # Load already processed articles from the file
    try:
        already_processed_content = env.read_file(processed_file_path)
        already_processed = json.loads(already_processed_content)
    except:
        env.add_system_log("No processed articles file found, creating a new one")
        already_processed = []
    
    env.add_system_log(f"Found {len(already_processed)} already processed articles")
    
    # Filter out articles already processed
    new_articles = []
    for article in articles:
        if article.get("uri") not in already_processed:
            new_articles.append(article)
    
    env.add_system_log(f"Found {len(new_articles)} new articles")
    
    if not new_articles:
        env.add_reply("No new articles to process.")
        env.request_user_input()
        return
    
    # Group similar articles
    article_groups = group_similar_articles(env, new_articles, pre_grouped)
    env.add_system_log(f"Grouped articles into {len(article_groups)} groups")
    
    # Process each group
    results = []
    for group in article_groups:
        if len(group) >= 2:  # Only process groups with at least 2 sources
            env.add_system_log(f"Processing group with {len(group)} articles")
            
            # Process the article group
            result = process_article_group(env, group)
            results.append(result)
            
            # Add processed article IDs
            for article in group:
                if article.get("uri") not in already_processed:
                    already_processed.append(article.get("uri"))
    
    # Save processed article IDs
    # Only keep the last 1000 processed articles to avoid the file growing too large
    if len(already_processed) > 1000:
        already_processed = already_processed[-1000:]
    
    env.write_file(processed_file_path, json.dumps(already_processed))
    
    # Send the results to the API
    if results:
        env.add_system_log(f"Sending {len(results)} results to API")
        send_to_api(env, results)
        
        # Provide a summary to the user
        env.add_reply(f"Processed {len(results)} article groups with similar content.")
        for i, result in enumerate(results):
            summary = result.get("summary", "")
            sentiment = result.get("sentiment", "neutral")
            buy_recs = len(result.get("trading_recommendations", {}).get("buy", []))
            sell_recs = len(result.get("trading_recommendations", {}).get("sell", []))
            
            env.add_reply(f"Group {i+1}:\n- Summary: {summary[:150]}...\n- Sentiment: {sentiment}\n- Trading recommendations: {buy_recs} buy, {sell_recs} sell")
    else:
        env.add_reply("No article groups with multiple sources were found. Try adjusting the search criteria or checking back later.")
    
    env.add_system_log("NEAR AI agent finished successfully")
    env.request_user_input()

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

def fetch_articles(env: Environment, api_key: str) -> List[Dict]:
    """Fetch articles from the EventRegistry API."""
    env.add_system_log("Fetching articles from EventRegistry API")
    
    url = (
        "https://eventregistry.org/api/v1/minuteStreamArticles"
        "?query=%7B%22%24query%22%3A%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22categoryUri%22%3A%22dmoz%2FBusiness%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FSociety%2FGovernment%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FComputers%22%7D%5D%7D%2C%7B%22locationUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUnited_States%22%7D%2C%7B%22lang%22%3A%22eng%22%7D%5D%7D%2C%22%24filter%22%3A%7B%22startSourceRankPercentile%22%3A0%2C%22endSourceRankPercentile%22%3A10%7D%7D"
        f"&recentActivityArticlesUpdatesAfterMinsAgo=9000"  # Look back further to get more articles
        f"&apiKey={api_key}"
        "&callback=JSON_CALLBACK"
    )
    
    env.add_system_log(f"Making request to URL: {url}")
    
    try:
        response = requests.get(url)
        env.add_system_log(f"API Response status code: {response.status_code}")
        
        # Log the first part of the response for debugging
        response_preview = response.text[:200]
        env.add_system_log(f"Response preview: {response_preview}")
        
        # Extract JSON from the callback wrapper
        json_str = response.text
        
        # Remove the JSONP callback wrapper
        if json_str.startswith("JSON_CALLBACK(") and json_str.endswith(")"):
            json_str = json_str[len("JSON_CALLBACK("):-1]
            env.add_system_log("Removed JSON_CALLBACK wrapper")
        else:
            env.add_system_log(f"Warning: Expected JSON_CALLBACK wrapper not found. Start: {json_str[:15]}, End: {json_str[-15:]}")
        
        # Parse the JSON
        try:
            data = json.loads(json_str)
            env.add_system_log("Successfully parsed JSON response")
            
            # Extract the articles from the response
            articles = data.get("recentActivityArticles", {}).get("activity", [])
            
            # Filter for valid articles with title and body
            valid_articles = []
            for article in articles:
                if "title" in article and "body" in article and "uri" in article:
                    valid_articles.append(article)
            
            env.add_system_log(f"Found {len(articles)} total articles, {len(valid_articles)} valid articles")
            
            # Group by eventUri - articles about the same event already have the same eventUri
            # This is more reliable than our own grouping
            event_groups = {}
            for article in valid_articles:
                event_uri = article.get("eventUri")
                if event_uri and event_uri != "null":
                    if event_uri not in event_groups:
                        event_groups[event_uri] = []
                    event_groups[event_uri].append(article)
            
            # Add all non-event articles as individual items
            pre_grouped_articles = []
            for event_uri, group in event_groups.items():
                if len(group) >= 2:  # Only include groups with at least 2 articles
                    pre_grouped_articles.append(group)
                    env.add_system_log(f"Found event group with {len(group)} articles for event {event_uri}")
            
            # Also include articles without eventUri for further grouping
            remaining_articles = [a for a in valid_articles if not a.get("eventUri") or a.get("eventUri") == "null"]
            
            env.add_system_log(f"Articles pre-grouped by eventUri: {len(pre_grouped_articles)} groups")
            env.add_system_log(f"Remaining articles for content grouping: {len(remaining_articles)}")
            
            return valid_articles, pre_grouped_articles, remaining_articles
        except json.JSONDecodeError as json_error:
            env.add_system_log(f"JSON parsing error: {str(json_error)}")
            env.add_system_log(f"Failed JSON snippet: {json_str[:100]}...{json_str[-100:]}")
            return [], [], []
    except Exception as e:
        env.add_system_log(f"Error fetching articles: {str(e)}")
        try:
            env.add_system_log(f"Response content: {response.text[:500]}...")
        except:
            env.add_system_log("Could not access response content")
        return [], [], []

def group_similar_articles(env: Environment, articles: List[Dict], pre_grouped: List[List[Dict]]) -> List[List[Dict]]:
    """Group similar articles together based on their content."""
    env.add_system_log("Grouping similar articles")
    
    # Start with our pre-grouped articles (already grouped by eventUri)
    article_groups = pre_grouped.copy()
    
    if not articles:
        return article_groups
    
    # Step 1: Try to group by duplicate flag and title similarity
    title_groups = {}
    for article in articles:
        # Normalize the title - lowercase, remove punctuation
        title = article.get("title", "").lower()
        title = re.sub(r'[^\w\s]', '', title)
        
        # Create a simple hash from the first few words of the title
        words = title.split()
        if len(words) >= 3:
            title_hash = " ".join(words[:3])  # First 3 words as a basic hash
            if title_hash not in title_groups:
                title_groups[title_hash] = []
            title_groups[title_hash].append(article)
    
    # Add groups that have at least 2 articles
    for title_hash, group in title_groups.items():
        if len(group) >= 2:
            article_groups.append(group)
            env.add_system_log(f"Found title-based group with {len(group)} articles: {title_hash}")
    
    # If we already have enough groups, just return them
    if len(article_groups) >= 3:
        env.add_system_log(f"Found {len(article_groups)} groups - skipping AI-based grouping")
        return article_groups
    
    # For remaining articles, use AI to find semantic similarity
    # Collect articles that weren't grouped by title
    remaining_articles = []
    grouped_uris = set()
    for group in article_groups:
        for article in group:
            grouped_uris.add(article.get("uri"))
    
    for article in articles:
        if article.get("uri") not in grouped_uris:
            remaining_articles.append(article)
    
    if not remaining_articles or len(remaining_articles) < 2:
        return article_groups
    
    env.add_system_log(f"Using AI to group remaining {len(remaining_articles)} articles")
    
    # Using AI to group remaining articles
    article_titles = [article.get("title", "") for article in remaining_articles]
    article_bodies = [article.get("body", "")[:500] for article in remaining_articles]  # Use first 500 chars of body for comparison
    
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
            for group in groups_ids:
                article_group = [remaining_articles[idx] for idx in group if idx < len(remaining_articles)]
                if len(article_group) >= 2:  # Only include groups with at least 2 articles
                    article_groups.append(article_group)
            
            env.add_system_log(f"AI found {len(article_groups)} groups of similar articles")
        else:
            env.add_system_log("Could not extract groups from AI response")
    except Exception as e:
        env.add_system_log(f"Error parsing AI grouping: {str(e)}")
    
    return article_groups

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

def send_to_api(env: Environment, results: List[Dict]):
    """Send the processed results to the API endpoint."""
    env.add_system_log("Sending results to API endpoint")
    
    # Get the API endpoint from environment variables
    api_endpoint = env.env_vars.get("API_ENDPOINT", "http://localhost:8000/api/news")
    
    # Prepare the payload
    payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "article_groups": results
    }
    
    try:
        # Send the results to the API
        response = requests.post(api_endpoint, json=payload)
        env.add_system_log(f"API response status: {response.status_code}")
    except Exception as e:
        env.add_system_log(f"Error sending to API: {str(e)}")

# Run the agent
run(env) 