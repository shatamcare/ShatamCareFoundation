# Development Environment

## Local Development Server

This project uses port 5174 for local development. This is configured in:

- `vite.config.ts`
- `package.json` scripts
- URL helper utilities

### Starting the Development Server

Use one of these commands to start the development server:

```bash
# Using npm script (recommended)
npm run dev

# OR using the dedicated start script
npm start
```

The server will start at: http://localhost:5174

### Important Notes

- If you encounter errors about incorrect URLs, make sure you're accessing http://localhost:5174 and not any other port
- The port 5173 (Vite's default) should not be used to maintain consistency across the project
- For production, the site is deployed to GitHub Pages at https://adarshalexbalmuchu.github.io/ShatamCareFoundation/
