const baseURL = "http://localhost:7000"

export default {
  'GET': baseURL + '/api/all',
  'POST': baseURL + '/api/create',
  'PUT': baseURL + '/api/update',
  'DELETE': baseURL + '/api/delete',
  'signin': baseURL + '/api/signin'
}