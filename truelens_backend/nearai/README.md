# News Analyzer NEAR AI Agent

This NEAR AI agent fetches news articles from EventRegistry, analyzes them, merges similar articles, and provides summaries with sentiment analysis and trading recommendations.

## Features

- Fetches news articles every hour from EventRegistry
- Groups similar articles to avoid duplication
- Generates comprehensive summaries of related news articles
- Provides sentiment analysis (positive/negative/neutral)
- Creates trading recommendations (specific stocks that might benefit or suffer)
- Maintains a cache to avoid reporting the same articles twice
- Sends processed results to an API endpoint

## Setup and Deployment

### Prerequisites

- NEAR AI CLI installed and configured
- A NEAR wallet account
- (Optional) EventRegistry API key

### Configuration

The agent uses the following environment variables:

- `EVENT_REGISTRY_API_KEY`: Your EventRegistry API key (optional, a default key is provided)
- `API_ENDPOINT`: The endpoint to send the processed news to (default: http://localhost:8000/api/news)

### Setting Up Secrets

To securely store your API key:

```bash
nearai secrets set EVENT_REGISTRY_API_KEY "your-api-key-here"
```

### Running the Agent Locally

1. Start the API server:

```bash
cd truelens_backend/nearai
python api_server.py
```

2. In another terminal, run the agent:

```bash
nearai agent interactive path/to/truelens_backend/nearai --local
```

### Deploying to NEAR AI

To upload the agent to the NEAR AI registry:

```bash
nearai registry upload path/to/truelens_backend/nearai
```

## How It Works

1. The agent runs every hour and fetches recent news articles from EventRegistry focused on business, government, and tech categories in the United States.

2. It uses AI to group similar articles based on their content.

3. For each group with at least 2 sources, it:
   - Creates a comprehensive summary
   - Analyzes the sentiment of the news
   - Generates specific trading recommendations

4. The processed results are sent to the API endpoint and cached to avoid duplication.

## API Endpoints

The included API server provides the following endpoints:

- `POST /api/news`: Receives processed news articles from the agent
- `GET /api/news`: Returns all processed news articles
- `GET /api/news/latest`: Returns the most recently processed news articles

## Customization

You can customize the agent by:

1. Modifying the search query in the `fetch_articles` function to focus on different topics or regions
2. Adjusting the AI model parameters in `metadata.json` to control the response quality and cost
3. Extending the API server to integrate with other systems

## Troubleshooting

- If the agent isn't receiving articles, check your EventRegistry API key and internet connection
- If similar articles aren't being grouped correctly, you may need to adjust the AI prompt in the `group_similar_articles` function
- For API connection issues, verify the API server is running and accessible

## License

This project is open source and available under the MIT License. 