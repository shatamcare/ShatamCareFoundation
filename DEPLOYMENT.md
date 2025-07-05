# Deployment Guide for Shatam Care Foundation Website

This guide explains how to deploy the Shatam Care Foundation website to GitHub Pages.

## Prerequisites

1. Node.js (v18 or higher)
2. npm or bun
3. Git
4. GitHub account with repository access

## Deployment Methods

### Method 1: Automatic Deployment (Recommended)

The website is automatically deployed to GitHub Pages when you push to the `main` branch using GitHub Actions.

**Setup:**
1. Go to your GitHub repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically trigger on every push to main

**URL:** https://adarshalexbalmuchu.github.io/ShatamCareFoundation/

### Method 2: Manual Deployment

You can also deploy manually using the following commands:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

Or use the deploy script:

```bash
# Make the script executable (Linux/Mac)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## Configuration

### Vite Configuration

The `vite.config.ts` is configured with:
- Base path: `/ShatamCareFoundation/` (matches your repository name)
- Build optimizations for production
- Asset handling for GitHub Pages

### GitHub Actions

The `.github/workflows/deploy.yml` file:
- Triggers on push to main branch
- Builds the project using Node.js 20
- Deploys to GitHub Pages automatically
- Handles permissions and artifacts

## Important Notes

1. **Repository Name**: The base path in `vite.config.ts` must match your repository name
2. **GitHub Pages**: Must be enabled in repository settings
3. **Build Directory**: The built files are in the `dist` folder
4. **Domain**: The site will be available at `https://[username].github.io/[repository-name]/`

## Troubleshooting

### Common Issues

1. **404 Error**: Check that the base path in `vite.config.ts` matches your repository name
2. **Assets Not Loading**: Ensure all asset paths are relative or use the correct base path
3. **Build Failures**: Check the Actions tab in GitHub for detailed error logs
4. **Permission Errors**: Ensure GitHub Pages is enabled and Actions have proper permissions

### Checking Deployment Status

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Check the latest workflow run
4. If successful, your site should be live at the GitHub Pages URL

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server runs on `http://localhost:8080`

## Contact

If you encounter issues with deployment, please check:
1. GitHub Actions logs
2. Repository settings
3. Network connectivity
4. Node.js and npm versions

For additional support, contact the development team.
