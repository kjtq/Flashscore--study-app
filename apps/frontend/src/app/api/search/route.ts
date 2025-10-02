import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://flashstudy-ri0g.onrender.com";

interface SearchParams {
  query: string;
  type?: 'all' | 'articles' | 'authors' | 'predictions';
  sport?: string;
  limit?: number;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  content: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all';
    const sport = searchParams.get('sport') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    const results: SearchResult[] = [];

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    };

    // Search predictions
    if (type === 'all' || type === 'predictions') {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/predictions?search=${encodeURIComponent(query)}&sport=${sport}&limit=${Math.floor(limit / 3)}`,
          fetchOptions
        );

        if (response.ok) {
          const predictions = await response.json();
          const formattedPredictions = (Array.isArray(predictions) ? predictions : predictions.data || [])
            .map((pred: any) => ({
              id: pred.id || pred._id,
              type: 'prediction',
              title: pred.title,
              content: pred.content,
              author: pred.authorName || pred.author?.name || 'Unknown',
              sport: pred.sport,
              confidence: pred.confidence ? `${pred.confidence}%` : 'N/A',
              publishDate: pred.createdAt || new Date().toISOString(),
              source: 'internal'
            }));

          results.push(...formattedPredictions);
        }
      } catch (error) {
        console.error('Error searching predictions:', error);
      }
    }

    // Search authors
    if (type === 'all' || type === 'authors') {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/authors?search=${encodeURIComponent(query)}&sport=${sport}&limit=${Math.floor(limit / 3)}`,
          fetchOptions
        );

        if (response.ok) {
          const authors = await response.json();
          const formattedAuthors = (Array.isArray(authors) ? authors : authors.data || [])
            .map((author: any) => ({
              id: author.id || author._id,
              type: 'author',
              title: author.name,
              content: author.bio || '',
              expertise: author.expertise || [],
              winRate: author.winRate || 
                      (author.stats?.correctPredictions && author.stats?.totalPredictions 
                        ? Math.round((author.stats.correctPredictions / author.stats.totalPredictions) * 100)
                        : 0),
              totalPredictions: author.stats?.totalPredictions || 0,
              source: 'internal'
            }));

          results.push(...formattedAuthors);
        }
      } catch (error) {
        console.error('Error searching authors:', error);
      }
    }

    // Search articles/news
    if (type === 'all' || type === 'articles') {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/news?search=${encodeURIComponent(query)}&sport=${sport}&limit=${Math.floor(limit / 3)}`,
          fetchOptions
        );

        if (response.ok) {
          const news = await response.json();
          const formattedNews = (Array.isArray(news) ? news : news.data || [])
            .map((article: any) => ({
              id: article.id || article._id,
              type: 'article',
              title: article.title,
              content: article.preview || article.content || article.fullContent || '',
              author: article.author?.name || article.authorName || 'Unknown',
              tags: article.tags || [],
              publishDate: article.createdAt || article.publishDate,
              source: article.source || 'internal'
            }));

          results.push(...formattedNews);
        }
      } catch (error) {
        console.error('Error searching news:', error);
      }
    }

    // Sort results by relevance (simple scoring based on title match)
    const queryLower = query.toLowerCase();
    results.sort((a, b) => {
      // Exact title match scores highest
      const aExactMatch = a.title.toLowerCase() === queryLower ? 10 : 0;
      const bExactMatch = b.title.toLowerCase() === queryLower ? 10 : 0;
      
      // Title contains query
      const aTitleMatch = a.title.toLowerCase().includes(queryLower) ? 5 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(queryLower) ? 5 : 0;
      
      // Content contains query
      const aContentMatch = a.content?.toLowerCase().includes(queryLower) ? 2 : 0;
      const bContentMatch = b.content?.toLowerCase().includes(queryLower) ? 2 : 0;
      
      const aScore = aExactMatch + aTitleMatch + aContentMatch;
      const bScore = bExactMatch + bTitleMatch + bContentMatch;
      
      return bScore - aScore;
    });

    // Apply final limit
    const limitedResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      results: limitedResults,
      total: results.length,
      returned: limitedResults.length,
      query,
      filters: { type, sport, limit }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59'
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {}, advanced = {} } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Valid search query is required' },
        { status: 400 }
      );
    }

    // Build search parameters
    const searchParams = new URLSearchParams({
      query: query.trim(),
      type: filters.type || 'all',
      sport: filters.sport || 'all',
      limit: (filters.limit || 20).toString()
    });

    // Forward advanced filters to backend
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(
      `${BACKEND_URL}/api/search?${searchParams}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { 'Authorization': authHeader })
        },
        body: JSON.stringify({
          query,
          filters,
          advanced
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid request body',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}