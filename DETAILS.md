# Endpoints Documentation

## User Roles: 
- Supreme Admin
- Admin
- Contributor

## Possible Tables (Just Some suggentions): 
- Users
- Categories (Python, Web, DevOps, etc...)
- Articles
- Applicants

## All Needed Endpoints are as follows:
- POST /auth/login - Authentication Endpoint for both Contributors and Admins (It should make checks with the email to determine the role of the user that's logging in)
- GET /articles - Get All Approved Articles
- GET /articles/pending - Get All Articles waiting to be published
- POST /articles - Submit an Article for publishing
- PUT /articles/publish - Publish a submitted article
- PUT /articles/:articleId/archive - Archive an Article 
- GET /articles/:contributorId - Get All Articles by a certain contributor
- GET /articles/:categoryId - Get all Articles for a certain category
- GET /categories - Get All Categories
- POST /categories - Add a category (Only Admin cn do this)
- DELETE/PUT - /categories/:categoryId - To Delete/Archive a category (Not sure how this should be so i leave it to your discretion)
- GET /contributors - Get All Contributors
- POST /contributors - Register a Contributor
- GET /applicants - Get All Contributors Applications
- POST /applicants - Submit an application to be an contributor
- PATCH /applicants/:applicationId/reviewed - Mark an application as reviewed 
- DELETE /applicants/:applicantId - Delete an Contributor Application
- POST /admin - Add an Admin (Only Supreme Admins can do this)

### *Note: If at the end contributors and admins will be using the same data for registration, only 1 endpoint will be needed instead of 2.*
