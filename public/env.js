// Runtime environment config for frontend
// Edit this file in production to change the API_URL without rebuilding
(function (window) {
  window.__env = window.__env || {};

  // Default API URL (can be overridden)
  window.__env.API_URL = window.__env.API_URL || 'http://localhost:3000';
}(this));
