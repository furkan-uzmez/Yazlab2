// Filter utility functions

export const filterBooks = (books, searchQuery, activeCategory, filters) => {
  return books.filter(book => {
    // Search filter
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    let matchesCategory = true;
    const currentYear = new Date().getFullYear();
    const bookYear = new Date(book.release_date).getFullYear();
    
    switch (activeCategory) {
      case 'new':
        matchesCategory = bookYear >= currentYear - 2;
        break;
      case 'top-rated':
        matchesCategory = book.vote_average >= 8.0;
        break;
      case 'popular':
      default:
        matchesCategory = true;
    }

    // Genre filter
    const matchesGenre = filters.genres.length === 0 || 
      filters.genres.some(genreId => book.genre_ids.includes(genreId));

    // Year filter
    const matchesYear = (!filters.yearFrom || bookYear >= parseInt(filters.yearFrom)) &&
                       (!filters.yearTo || bookYear <= parseInt(filters.yearTo));

    // Rating filter
    const matchesRating = (!filters.ratingFrom || book.vote_average >= parseFloat(filters.ratingFrom)) &&
                         (!filters.ratingTo || book.vote_average <= parseFloat(filters.ratingTo));

    return matchesSearch && matchesCategory && matchesGenre && matchesYear && matchesRating;
  });
};

export const sortBooks = (books, sortBy) => {
  return [...books].sort((a, b) => {
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

