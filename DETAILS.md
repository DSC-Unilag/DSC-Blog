# Endpoints Documentation

## User Roles: 
- Supreme Admin
- Admin
- Editor

## Possible Tables (Just Some suggentions): 
- Users
- Categories (Python, Web, DevOps, etc...)
- Articles
- Applicants

## All Needed Endpoints are as follows:
- POST /auth/login - Authentication Endpoint for both Editor and Admins (It should make checks with the email to determine the role of the user that's logging in)
- GET /articles - Get All Approved Articles
- GET /articles/pending - Get All Articles waiting to be published
- POST /articles - Submit an Article for publishing
- PUT /articles/publish - Publish a submitted article
- PUT /articles/:articleId/archive - Archive an Article 
- GET /articles/:editorId - Get All Articles by a certain editor
- GET /articles/:categoryId - Get all Articles for a certain category
- GET /categories - Get All Categories
- POST /categories - Add a category (Only Admin cn do this)
- DELETE/PUT - /categories/:categoryId - To Delete/Archive a category (Not sure how this should be so i leave it to your discretion)
- GET /editors - Get All Editors
- POST /editors - Register an Editor
- GET /applicants - Get All Editors Applications
- POST /applicants - Submit an application to be an editor
- PATCH /applicants/:applicationId/reviewed - Mark an application as reviewed 
- DELETE /applicants/:applicantId - Delete an Editor Application
- POST /admin - Add an Admin (Only Supreme Admins can do this)

### *Note: If at the end editors and admins will be using the same data for registration, only 1 endpoint will be needed instead of 2.*
