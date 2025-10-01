import { FastifyRequest, FastifyReply } from "fastify";
import { NewsAuthorService } from "../services/newsAuthorService";

export class NewsAuthorController {
  // GET /api/news-authors - Get all active authors
  static async getAllAuthors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authors = await NewsAuthorService.getActiveAuthors();

      reply.code(200).send({
        success: true,
        data: authors,
        message: "Authors fetched successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch authors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // GET /api/news-authors/:id - Get author by ID
  static async getAuthorById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const author = await NewsAuthorService.getAuthorById(id);

      if (!author) {
        return reply.code(404).send({
          success: false,
          message: "Author not found",
        });
      }

      reply.code(200).send({
        success: true,
        data: author,
        message: "Author fetched successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to fetch author",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors - Create or update author
  static async createOrUpdateAuthor(
    request: FastifyRequest<{
      Body: {
        id: string;
        name: string;
        icon: string;
        bio?: string;
        expertise?: string[];
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const authorData = request.body;

      if (!authorData.id || !authorData.name || !authorData.icon) {
        return reply.code(400).send({
          success: false,
          message: "Author ID, name, and icon are required",
        });
      }

      const author = await NewsAuthorService.createOrUpdateAuthor(authorData);

      reply.code(200).send({
        success: true,
        data: author,
        message: "Author created/updated successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to create/update author",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/:id/collaborate - Create news from collaboration
  static async createCollaborationNews(
    request: FastifyRequest<{
      Params: { id: string };
      Body: {
        title: string;
        preview: string;
        fullContent: string;
        collaborationType: "prediction" | "analysis" | "community" | "update";
        tags?: string[];
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;
      const collaborationData = request.body;

      if (
        !collaborationData.title ||
        !collaborationData.preview ||
        !collaborationData.fullContent
      ) {
        return reply.code(400).send({
          success: false,
          message: "Title, preview, and full content are required",
        });
      }

      const news = await NewsAuthorService.createCollaborationNews(
        id,
        collaborationData,
      );

      reply.code(201).send({
        success: true,
        data: news,
        message: "Collaboration news created successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to create collaboration news",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/auto-news - Generate automatic news
  static async generateAutoNews(
    request: FastifyRequest<{
      Body: {
        authorId: string;
        eventType: string;
        eventData: any;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { authorId, eventType, eventData } = request.body;

      if (!authorId || !eventType) {
        return reply.code(400).send({
          success: false,
          message: "Author ID and event type are required",
        });
      }

      const news = await NewsAuthorService.generateAutoNews(
        authorId,
        eventType,
        eventData,
      );

      if (!news) {
        return reply.code(400).send({
          success: false,
          message: "Could not generate news for this event",
        });
      }

      reply.code(201).send({
        success: true,
        data: news,
        message: "Auto news generated successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to generate auto news",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // POST /api/news-authors/initialize - Initialize default authors
  static async initializeDefaultAuthors(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      await NewsAuthorService.initializeDefaultAuthors();

      reply.code(200).send({
        success: true,
        message: "Default authors initialized successfully",
      });
    } catch (error) {
      reply.code(500).send({
        success: false,
        message: "Failed to initialize default authors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
const Author = require("@shared/models/Author");

class AuthorController {
  constructor() {
    this.authors = [];
    this.nextId = 1;
    this.initializeSampleData();
  }

  // Initialize sample data
  initializeSampleData() {
    const sampleAuthors = [
      new Author(
        this.nextId++,
        'John "The Rocket" Rodriguez',
        "john@sportsanalyst.com",
        "Former NFL quarterback turned elite sports analyst with 12+ years experience. Known for accurate game predictions and deep statistical analysis.",
        ["Football", "Soccer", "Basketball"],
        true,
        [
          {
            id: "expert_predictor",
            name: "Expert Predictor",
            description: "85% win rate",
            icon: "🏆",
            color: "#FFD700",
          },
          {
            id: "veteran",
            name: "Veteran",
            description: "500+ predictions",
            icon: "⭐",
            color: "#9370DB",
          },
          {
            id: "popular",
            name: "Popular",
            description: "120 followers",
            icon: "👥",
            color: "#1E90FF",
          },
        ],
        {
          totalPredictions: 523,
          correctPredictions: 445,
          winStreak: 8,
          maxWinStreak: 15,
          followers: 120,
          engagement: 2500,
        },
      ),

      new Author(
        this.nextId++,
        'Dr. Sarah "Hoops" Williams',
        "sarah@hoopsexpert.com",
        "PhD in Sports Psychology, former WNBA player with championship ring. Specializes in player performance analysis and team dynamics.",
        ["Basketball", "Volleyball"],
        true,
        [
          {
            id: "hot_streak",
            name: "Hot Streak",
            description: "12 correct in a row",
            icon: "🔥",
            color: "#FF4500",
          },
          {
            id: "scholar",
            name: "Scholar",
            description: "PhD in Sports Science",
            icon: "🎓",
            color: "#4169E1",
          },
          {
            id: "champion",
            name: "Champion",
            description: "Former professional athlete",
            icon: "🥇",
            color: "#FFD700",
          },
        ],
        {
          totalPredictions: 287,
          correctPredictions: 231,
          winStreak: 12,
          maxWinStreak: 12,
          followers: 89,
          engagement: 1800,
        },
      ),

      new Author(
        this.nextId++,
        'Mike "Ace" Thompson',
        "mike@tennispro.com",
        "Wimbledon coach of the year 2022. Tennis prediction genius with insider knowledge of player conditions and court advantages.",
        ["Tennis", "Badminton"],
        true,
        [
          {
            id: "insider",
            name: "Insider",
            description: "Professional coach access",
            icon: "🔐",
            color: "#32CD32",
          },
          {
            id: "specialist",
            name: "Specialist",
            description: "Tennis expert",
            icon: "🎾",
            color: "#FFFF00",
          },
        ],
        {
          totalPredictions: 156,
          correctPredictions: 127,
          winStreak: 3,
          maxWinStreak: 9,
          followers: 67,
          engagement: 1200,
        },
      ),

      new Author(
        this.nextId++,
        'Alexandra "The Oracle" Chen',
        "alex@soccerpro.com",
        "International soccer analyst, UEFA certified coach. Fluent in 5 languages, covers European and Asian leagues with 90%+ accuracy.",
        ["Soccer", "Football"],
        true,
        [
          {
            id: "expert_predictor",
            name: "Expert Predictor",
            description: "92% win rate",
            icon: "🏆",
            color: "#FFD700",
          },
          {
            id: "international",
            name: "International",
            description: "Multi-league expert",
            icon: "🌍",
            color: "#00CED1",
          },
          {
            id: "rising_star",
            name: "Rising Star",
            description: "Fastest growing follower base",
            icon: "🌟",
            color: "#FF69B4",
          },
        ],
        {
          totalPredictions: 342,
          correctPredictions: 315,
          winStreak: 6,
          maxWinStreak: 18,
          followers: 156,
          engagement: 3200,
        },
      ),

      new Author(
        this.nextId++,
        'Marcus "Lightning" Johnson',
        "marcus@speedster.com",
        "Olympic track and field consultant. Masters degree in Biomechanics. Predicts athletic performance with scientific precision.",
        ["Track & Field", "Swimming", "Cycling"],
        true,
        [
          {
            id: "scientist",
            name: "Scientist",
            description: "Data-driven analysis",
            icon: "🧪",
            color: "#9ACD32",
          },
          {
            id: "olympic",
            name: "Olympic",
            description: "Olympic consultant",
            icon: "🥇",
            color: "#FFD700",
          },
        ],
        {
          totalPredictions: 78,
          correctPredictions: 67,
          winStreak: 4,
          maxWinStreak: 7,
          followers: 34,
          engagement: 680,
        },
      ),

      new Author(
        this.nextId++,
        'Isabella "Ice Queen" Petrov',
        "isabella@winterpro.com",
        "Former Olympic figure skater, now covers winter sports exclusively. Known for her cold calculations and hot predictions.",
        ["Ice Hockey", "Figure Skating", "Skiing"],
        true,
        [
          {
            id: "winter_specialist",
            name: "Winter Specialist",
            description: "Winter sports expert",
            icon: "❄️",
            color: "#87CEEB",
          },
          {
            id: "perfectionist",
            name: "Perfectionist",
            description: "95% accuracy this season",
            icon: "💎",
            color: "#B0C4DE",
          },
        ],
        {
          totalPredictions: 124,
          correctPredictions: 118,
          winStreak: 7,
          maxWinStreak: 14,
          followers: 78,
          engagement: 1560,
        },
      ),

      new Author(
        this.nextId++,
        'Captain Jake "Storm" Morrison',
        "jake@extremepro.com",
        "Extreme sports veteran and X-Games commentator. Predicts the unpredictable in high-adrenaline competitions.",
        ["Surfing", "Skateboarding", "Snowboarding", "BMX"],
        true,
        [
          {
            id: "daredevil",
            name: "Daredevil",
            description: "Extreme sports specialist",
            icon: "🏄",
            color: "#FF6347",
          },
          {
            id: "trendsetter",
            name: "Trendsetter",
            description: "Spots rising talent early",
            icon: "📈",
            color: "#20B2AA",
          },
        ],
        {
          totalPredictions: 95,
          correctPredictions: 76,
          winStreak: 2,
          maxWinStreak: 6,
          followers: 112,
          engagement: 2240,
        },
      ),

      new Author(
        this.nextId++,
        'Professor Emma "Stats" Kumar',
        "emma@mathsports.edu",
        "MIT graduate, Sports Analytics professor. Uses advanced algorithms and machine learning for prediction models.",
        ["Baseball", "Cricket", "Statistics"],
        true,
        [
          {
            id: "professor",
            name: "Professor",
            description: "Academic credentials",
            icon: "👩‍🏫",
            color: "#4B0082",
          },
          {
            id: "algorithm",
            name: "Algorithm",
            description: "AI-powered predictions",
            icon: "🤖",
            color: "#00FF7F",
          },
          {
            id: "researcher",
            name: "Researcher",
            description: "Published sports analyst",
            icon: "📊",
            color: "#FF1493",
          },
        ],
        {
          totalPredictions: 456,
          correctPredictions: 378,
          winStreak: 5,
          maxWinStreak: 11,
          followers: 203,
          engagement: 4060,
        },
      ),
    ];

    this.authors = sampleAuthors;
  }

  // Get all authors
  getAllAuthors() {
    try {
      return this.authors
        .filter((author) => author.isActive)
        .map((author) => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors: ${error.message}`);
    }
  }

  // Get author by ID
  getAuthorById(id) {
    try {
      const author = this.authors.find((a) => a.id === parseInt(id));
      if (!author) {
        throw new Error("Author not found");
      }
      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error fetching author: ${error.message}`);
    }
  }

  // Create new author
  createAuthor(authorData) {
    try {
      const author = new Author(
        this.nextId++,
        authorData.name,
        authorData.email,
        authorData.bio,
        authorData.expertise,
      );

      const validation = author.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Check if email already exists
      const existingAuthor = this.authors.find(
        (a) => a.email === author.email && a.isActive,
      );
      if (existingAuthor) {
        throw new Error("Author with this email already exists");
      }

      this.authors.push(author);
      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error creating author: ${error.message}`);
    }
  }

  // Update author
  updateAuthor(id, updateData) {
    try {
      const author = this.authors.find((a) => a.id === parseInt(id));
      if (!author) {
        throw new Error("Author not found");
      }

      // If email is being updated, check for duplicates
      if (updateData.email && updateData.email !== author.email) {
        const existingAuthor = this.authors.find(
          (a) =>
            a.email === updateData.email && a.isActive && a.id !== author.id,
        );
        if (existingAuthor) {
          throw new Error("Another author with this email already exists");
        }
      }

      author.update(updateData);

      const validation = author.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error updating author: ${error.message}`);
    }
  }

  // Delete author (soft delete)
  deleteAuthor(id) {
    try {
      const author = this.authors.find((a) => a.id === parseInt(id));
      if (!author) {
        throw new Error("Author not found");
      }

      author.isActive = false;
      author.updatedAt = new Date();

      return { success: true, message: "Author deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting author: ${error.message}`);
    }
  }

  // Get authors by expertise
  getAuthorsByExpertise(sport) {
    try {
      return this.authors
        .filter(
          (author) =>
            author.isActive &&
            author.expertise.some(
              (exp) => exp.toLowerCase() === sport.toLowerCase(),
            ),
        )
        .map((author) => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors by expertise: ${error.message}`);
    }
  }

  // Search authors by name
  searchAuthors(searchTerm) {
    try {
      const term = searchTerm.toLowerCase();
      return this.authors
        .filter(
          (author) =>
            author.isActive && author.name.toLowerCase().includes(term),
        )
        .map((author) => author.toDisplay());
    } catch (error) {
      throw new Error(`Error searching authors: ${error.message}`);
    }
  }

  // Get author statistics
  getAuthorStats(id) {
    try {
      const author = this.authors.find((a) => a.id === parseInt(id));
      if (!author) {
        throw new Error("Author not found");
      }

      return {
        ...author.toDisplay(),
        winRate: `${author.getWinRate()}%`,
        level: author.getLevel(),
        rank: this.getAuthorRank(author.id),
      };
    } catch (error) {
      throw new Error(`Error fetching author statistics: ${error.message}`);
    }
  }

  // Get author rank based on performance
  getAuthorRank(id) {
    const sortedAuthors = this.authors
      .filter((a) => a.isActive)
      .sort((a, b) => {
        const scoreA = a.getWinRate() * a.stats.totalPredictions;
        const scoreB = b.getWinRate() * b.stats.totalPredictions;
        return scoreB - scoreA;
      });

    return sortedAuthors.findIndex((a) => a.id === parseInt(id)) + 1;
  }

  // Get top performing authors
  getTopAuthors(limit = 5) {
    try {
      return this.authors
        .filter((a) => a.isActive && a.stats.totalPredictions > 10)
        .sort((a, b) => {
          const scoreA =
            a.getWinRate() * Math.log(a.stats.totalPredictions + 1);
          const scoreB =
            b.getWinRate() * Math.log(b.stats.totalPredictions + 1);
          return scoreB - scoreA;
        })
        .slice(0, limit)
        .map((author) => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching top authors: ${error.message}`);
    }
  }

  // Simulate following an author
  followAuthor(id) {
    try {
      const author = this.authors.find((a) => a.id === parseInt(id));
      if (!author) {
        throw new Error("Author not found");
      }

      author.stats.followers += 1;
      author.stats.engagement += 10;
      author.updatedAt = new Date();

      // Check for new badges
      const newBadges = author.checkForNewBadges();

      return {
        success: true,
        message: "Author followed successfully",
        newBadges: newBadges,
      };
    } catch (error) {
      throw new Error(`Error following author: ${error.message}`);
    }
  }

  // Get authors by badge type
  getAuthorsByBadge(badgeId) {
    try {
      return this.authors
        .filter(
          (author) =>
            author.isActive &&
            author.badges.some((badge) => badge.id === badgeId),
        )
        .map((author) => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors by badge: ${error.message}`);
    }
  }
}

module.exports = AuthorController;
