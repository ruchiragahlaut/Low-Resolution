# Low-resolution image classification

## Project structure

```
(application/frontend)
|-- README.md: project instructions
|
|-- client: contains the frontend code for the client site (react)
|   |-- README.md: project instructions
|   |-- package.json: node dependencies
|   |-- package-lock.json: node dependencies (auto-generated)
|   |-- .gitignore: files to ignore in git
|   |-- .env: environment variables
|   |-- src: contains the react code
|   |   |-- index.js: react app entry point
|   |   |-- App.js: react app component
|   |   |-- index.css: react app styles
|   |   |-- background.jpg: react app background image
|   |   |-- logo.png: react app logo image
|   |   |
|   |   |-- base: base template
|   |   |   |-- context.jsx: react contexts
|   |   |   |-- router.jsx: react router
|   |   |   |-- theme.jsx: Material UI react theme provider
|   |   |   \-- template.jsx: Combines above 3 components
|   |   |
|   |   |-- layout: Page UI layout componenet
|   |   |   |-- header.jsx: Header component
|   |   |   \-- sidebar.jsx: Sidebar component
|   |   |
|   |   \-- pages: Page components
|   |       |-- index.jsx: Landing page
|   |       |-- detect.jsx
|   |       |-- batch.jsx
|   |       |-- retrain.jsx (not implemented)
|   |       \-- database.jsx (not implemented)
|   \-- public: contains the react app html template
|
\-- admin: contains the frontend code for the admin site (not implemented)
```
