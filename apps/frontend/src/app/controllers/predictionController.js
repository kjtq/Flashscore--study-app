
const Prediction = require('@shared/models/predict.py');
const Author = require('@shared/models/Author');

class PredictionController {
  constructor() {
    // In a real app, this would connect to a database
    this.predictions = [];
    this.authors = [];
    this.nextId = 1;
    this.nextAuthorId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // Initialize sample data
  initializeSampleData() {
    // Create sample authors
    const sampleAuthors = [
      new Author(this.nextAuthorId++, 'John Sports', 'john@sportsanalyst.com', 'Expert football analyst with 10 years experience', ['Football', 'Soccer']),
      new Author(this.nextAuthorId++, 'Sarah Basketball', 'sarah@hoopsexpert.com', 'Former professional basketball player turned analyst', ['Basketball']),
      new Author(this.nextAuthorId++, 'Mike Tennis', 'mike@tennispro.com', 'Tennis coach and prediction specialist', ['Tennis'])
    ];
    
    this.authors = sampleAuthors;

    // Create sample predictions
    const samplePredictions = [
      new Prediction(
        this.nextId++,
        'Manchester United vs Liverpool - Home Win Expected',
        'Manchester United shows strong form at home this season. With key players returning from injury, expect a solid victory.',
        1,
        'Football',
        { home: 'Manchester United', away: 'Liverpool', date: new Date('2024-01-20') },
        75,
        'active'
      ),
      new Prediction(
        this.nextId++,
        'Lakers vs Warriors - High Scoring Game',
        'Both teams have been scoring heavily this season. Expect over 220 total points in this matchup.',
        2,
        'Basketball',
        { home: 'Lakers', away: 'Warriors', date: new Date('2024-01-21') },
        80,
        'active'
      )
    ];

    // Publish sample predictions
    samplePredictions.forEach(prediction => prediction.publish());
    this.predictions = samplePredictions;
  }

  // Get all active predictions
  getAllPredictions() {
    try {
      return this.predictions
        .filter(prediction => prediction.isActive && prediction.status === 'active')
        .map(prediction => prediction.toAPI());
    } catch (error) {
      throw new Error(`Error fetching predictions: ${error.message}`);
    }
  }

  // Get prediction by ID
  getPredictionById(id) {
    try {
      const prediction = this.predictions.find(p => p.id === parseInt(id));
      if (!prediction) {
        throw new Error('Prediction not found');
      }
      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error fetching prediction: ${error.message}`);
    }
  }

  // Get predictions by author
  getPredictionsByAuthor(authorId) {
    try {
      return this.predictions
        .filter(prediction => prediction.authorId === parseInt(authorId) && prediction.isActive)
        .map(prediction => prediction.toAPI());
    } catch (error) {
      throw new Error(`Error fetching author predictions: ${error.message}`);
    }
  }

  // Get predictions by sport
  getPredictionsBySport(sport) {
    try {
      return this.predictions
        .filter(prediction => 
          prediction.sport.toLowerCase() === sport.toLowerCase() && 
          prediction.isActive && 
          prediction.status === 'active'
        )
        .map(prediction => prediction.toAPI());
    } catch (error) {
      throw new Error(`Error fetching sport predictions: ${error.message}`);
    }
  }

  // Create new prediction
  createPrediction(predictionData) {
    try {
      const prediction = new Prediction(
        this.nextId++,
        predictionData.title,
        predictionData.content,
        predictionData.authorId,
        predictionData.sport,
        predictionData.matchDetails,
        predictionData.confidence,
        predictionData.status || 'pending'
      );

      const validation = prediction.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Verify author exists
      const author = this.authors.find(a => a.id === prediction.authorId);
      if (!author) {
        throw new Error('Author not found');
      }

      this.predictions.push(prediction);
      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error creating prediction: ${error.message}`);
    }
  }

  // Update prediction
  updatePrediction(id, updateData) {
    try {
      const prediction = this.predictions.find(p => p.id === parseInt(id));
      if (!prediction) {
        throw new Error('Prediction not found');
      }

      prediction.update(updateData);
      
      const validation = prediction.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error updating prediction: ${error.message}`);
    }
  }

  // Publish prediction
  publishPrediction(id) {
    try {
      const prediction = this.predictions.find(p => p.id === parseInt(id));
      if (!prediction) {
        throw new Error('Prediction not found');
      }

      prediction.publish();
      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error publishing prediction: ${error.message}`);
    }
  }

  // Complete prediction with result
  completePrediction(id, result) {
    try {
      const prediction = this.predictions.find(p => p.id === parseInt(id));
      if (!prediction) {
        throw new Error('Prediction not found');
      }

      prediction.complete(result);
      return prediction.toAPI();
    } catch (error) {
      throw new Error(`Error completing prediction: ${error.message}`);
    }
  }

  // Delete prediction
  deletePrediction(id) {
    try {
      const predictionIndex = this.predictions.findIndex(p => p.id === parseInt(id));
      if (predictionIndex === -1) {
        throw new Error('Prediction not found');
      }

      this.predictions[predictionIndex].isActive = false;
      return { success: true, message: 'Prediction deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting prediction: ${error.message}`);
    }
  }

  // Get prediction statistics
  getStatistics() {
    try {
      const total = this.predictions.filter(p => p.isActive).length;
      const active = this.predictions.filter(p => p.isActive && p.status === 'active').length;
      const completed = this.predictions.filter(p => p.isActive && p.status === 'completed').length;
      const winRate = completed > 0 ? 
        (this.predictions.filter(p => p.isActive && p.result === 'win').length / completed * 100).toFixed(1) 
        : 0;

      return {
        total,
        active,
        completed,
        winRate: `${winRate}%`
      };
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }

  // Get all authors
  getAllAuthors() {
    try {
      return this.authors
        .filter(author => author.isActive)
        .map(author => author.toDisplay());
    } catch (error) {
      throw new Error(`Error fetching authors: ${error.message}`);
    }
  }

  // Get author by ID
  getAuthorById(id) {
    try {
      const author = this.authors.find(a => a.id === parseInt(id));
      if (!author) {
        throw new Error('Author not found');
      }
      return author.toDisplay();
    } catch (error) {
      throw new Error(`Error fetching author: ${error.message}`);
    }
  }
}

module.exports = PredictionController;
