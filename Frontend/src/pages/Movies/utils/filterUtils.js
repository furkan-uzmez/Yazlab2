// Filter utility functions

export const filterMovies = (movies, searchQuery, activeCategory, filters) => {
  return movies.filter(movie => {
    // Search filter
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    let matchesCategory = true;
    const currentYear = new Date().getFullYear();
    const movieYear = new Date(movie.release_date).getFullYear();
    
    switch (activeCategory) {
      case 'new':
        matchesCategory = movieYear >= currentYear - 2;
        break;
      case 'top-rated':
        matchesCategory = movie.vote_average >= 8.0;
        break;
      case 'popular':
      default:
        matchesCategory = true;
    }

    // Genre filter
    const matchesGenre = filters.genres.length === 0 || 
      filters.genres.some(genreId => movie.genre_ids.includes(genreId));

    // Year filter
    const matchesYear = (!filters.yearFrom || movieYear >= parseInt(filters.yearFrom)) &&
                       (!filters.yearTo || movieYear <= parseInt(filters.yearTo));

    // Rating filter
    const matchesRating = (!filters.ratingFrom || movie.vote_average >= parseFloat(filters.ratingFrom)) &&
                         (!filters.ratingTo || movie.vote_average <= parseFloat(filters.ratingTo));

    return matchesSearch && matchesCategory && matchesGenre && matchesYear && matchesRating;
  });
};

export const sortMovies = (movies, sortBy) => {
  return [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'date':
        return new Date(b.release_date) - new Date(a.release_date);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'popularity':
      default:
        return 0;
    }
  });
};

export const hasActiveFilters = (filters) => {
  return filters.genres.length > 0 || 
         filters.yearFrom || 
         filters.yearTo || 
         filters.ratingFrom || 
         filters.ratingTo;
};

