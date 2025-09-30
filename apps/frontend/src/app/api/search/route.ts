
import { NextRequest, NextResponse } from 'next/server';
import PredictionController from '../../controllers/predictionController.js';
import AuthorController from '../../controllers/authorController.js';
import { NewsService } from '../../services/newsService';

const predictionController = new PredictionController();
const authorController = new AuthorController();

interface SearchParams {
  query: string;
  type?: 'all' | 'articles' | 'authors' | 'predictions';
  sport?: string;
  limit?: number;
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

    const results = [];

    // Search predictions
    if (type === 'all' || type === 'predictions') {
      try {
        const predictions = await predictionController.getAllPredictions();
        const filteredPredictions = predictions
          .filter((pred: any) => {
            const matchesQuery = pred.title?.toLowerCase().includes(query.toLowerCase()) ||
                                pred.content?.toLowerCase().includes(query.toLowerCase());
            const matchesSport = sport === 'all' || pred.sport?.toLowerCase() === sport.toLowerCase();
            return matchesQuery && matchesSport;
          })
          .slice(0, Math.floor(limit / 3))
          .map((pred: any) => ({
            id: pred.id || pred._id,
            type: 'prediction',
            title: pred.title,
            content: pred.content,
            author: pred.authorName || 'Unknown',
            sport: pred.sport,
            confidence: `${pred.confidence}%`,
            publishDate: pred.createdAt || new Date().toISOString(),
            source: 'internal'
          }));
        
        results.push(...filteredPredictions);
      } catch (error) {
        console.error('Error searching predictions:', error);
      }
    }

    // Search authors
    if (type === 'all' || type === 'authors') {
      try {
        const authors = await authorController.getAllAuthors();
        const filteredAuthors = authors
          .filter((author: any) => {
            const matchesQuery = author.name?.toLowerCase().includes(query.toLowerCase()) ||
                                author.bio?.toLowerCase().includes(query.toLowerCase());
            const matchesSport = sport === 'all' || 
                               author.expertise?.some((exp: string) => 
                                 exp.toLowerCase().includes(sport.toLowerCase())
                               );
            return matchesQuery && matchesSport;
          })
          .slice(0, Math.floor(limit / 3))
          .map((author: any) => ({
            id: author.id,
            type: 'author',
            title: author.name,
            content: author.bio,
            expertise: author.expertise,
            winRate: author.winRate || Math.round((author.stats?.correctPredictions / author.stats?.totalPredictions) * 100) || 0,
            source: 'internal'
          }));
        
        results.push(...filteredAuthors);
      } catch (error) {
        console.error('Error searching authors:', error);
      }
    }

    // Search articles/news
    if (type === 'all' || type === 'articles') {
      try {
        const news = await NewsService.getAllNews();
        const filteredNews = news
          .filter((article: any) => {
            const matchesQuery = article.title?.toLowerCase().includes(query.toLowerCase()) ||
                               article.preview?.toLowerCase().includes(query.toLowerCase()) ||
                               article.tags?.some((tag: string) => 
                                 tag.toLowerCase().includes(query.toLowerCase())
                               );
            const matchesSport = sport === 'all' || 
                               article.tags?.some((tag: string) => 
                                 tag.toLowerCase().includes(sport.toLowerCase())
                               );
            return matchesQuery && matchesSport;
          })
          .slice(0, Math.floor(limit / 3))
          .map((article: any) => ({
            id: article.id,
            type: 'article',
            title: article.title,
            content: article.preview || article.fullContent,
            author: article.author,
            tags: article.tags,
            publishDate: article.createdAt,
            source: 'internal'
          }));
        
        results.push(...filteredNews);
      } catch (error) {
        console.error('Error searching news:', error);
      }
    }

    // Sort results by relevance (simple scoring based on title match)
    results.sort((a, b) => {
      const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
      const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 2 : 1;
      return bScore - aScore;
    });

    return NextResponse.json({
      success: true,
      results: results.slice(0, limit),
      total: results.length,
      query,
      filters: { type, sport }
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

    // Advanced search logic can be implemented here
    // For now, redirect to GET with query params
    const searchParams = new URLSearchParams({
      query,
      type: filters.type || 'all',
      sport: filters.sport || 'all',
      limit: (filters.limit || 20).toString()
    });

    const url = new URL(`${request.url}?${searchParams}`);
    const getRequest = new NextRequest(url, { method: 'GET' });
    
    return GET(getRequest);

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
