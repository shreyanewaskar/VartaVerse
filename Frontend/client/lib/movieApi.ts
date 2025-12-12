import axios from "axios";

export const fetchMovies = async (title: string) => {
  try {
    const res = await axios.get(`http://localhost:8082/posts/movies/search`, {
      params: { title },
    });
    return res.data.Search || [];
  } catch (err) {
    console.error("Movie API Error:", err);
    return [];
  }
};

export const fetchDefaultMovies = async () => {
  try {
    const res = await axios.get(`http://localhost:8082/posts/movies/default`);
    return res.data.Search || [];
  } catch (err) {
    console.error("Default Movies API Error:", err);
    return [];
  }
};

export const fetchMovieById = async (imdbId: string) => {
  try {
    const res = await axios.get(`http://localhost:8082/posts/movies/${imdbId}`);
    return res.data;
  } catch (err) {
    console.error("Movie Detail API Error:", err);
    throw err;
  }
};

export const addMovieComment = async (imdbId: string, comment: string) => {
  try {
    const res = await axios.post(`http://localhost:8082/posts/movies/${imdbId}/comments`, {
      comment
    });
    return res.data;
  } catch (err) {
    console.error("Add Comment API Error:", err);
    throw err;
  }
};

export const getMovieComments = async (imdbId: string) => {
  try {
    const res = await axios.get(`http://localhost:8082/posts/movies/${imdbId}/comments`);
    return res.data;
  } catch (err) {
    console.error("Get Comments API Error:", err);
    return [];
  }
};