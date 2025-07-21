# Banaras Insider - Content & Taxi Booking Platform

This is the official repository for the Banaras Insider website, a high-performance content network built with Next.js and designed to be the ultimate travel guide for Varanasi. It combines in-depth, SEO-optimized articles with a direct lead generation funnel for the Vinayak Travels Tour taxi service.

This project is built on the principle of a Git-based CMS. All content (articles) is managed through simple Markdown files, making the entire site fast, secure, and easy to maintain.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

- Node.js (v18 or later recommended)
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone <your-repository-url>
   cd banaras-insider
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the development server:

   ```sh
   npm run dev
   ```

The application will now be running on http://localhost:3000. The site will automatically reload if you make changes to the code.

## Project Structure

The folder structure is organized to separate content, logic, pages, and components.

```
/
├── components/         # Reusable React components (NavBar, Footer, etc.)
├── content/            # All blog articles live here as Markdown files
│   ├── en/             # English articles
│   └── hi/             # Hindi articles
├── lib/                # Helper functions, e.g., for reading Markdown files (posts.js)
├── pages/              # Next.js pages, which map to URL routes
│   ├── api/            # API routes (e.g., for handling form submissions)
│   ├── [lang]/
│   │   ├── index.js    # Blog index page for a language (/en, /hi)
│   │   └── [slug].js   # Dynamic route for a single article
│   └── index.js        # The main homepage
├── public/             # Static assets (images, fonts, favicon)
├── styles/             # Global stylesheets and CSS Modules
└── ...                 # Config files (next.config.js, package.json, etc.)
```

## How to Add and Manage Content

This is the core workflow of the project. Every new article is a new Markdown file.

1. **Create a New File**: To create a new English article, add a file to the `/content/en/` directory. The filename will become the URL slug.
   - **Example**: `/content/en/my-new-post.md` will be accessible at `/en/my-new-post`.

2. **Use the Frontmatter Schema**: At the top of your new file, add the YAML frontmatter block with all the required metadata.

   ```yaml
   ---
   title: 'My Awesome New Post Title'
   slug: 'my-new-post'
   date: '2025-07-21'
   author: 'Abhinav Pandey'
   featuredImage: '/images/posts/my-new-image.jpg'
   description: 'A short, compelling summary of the article for SEO.'
   tags: ['guide', 'food', 'varanasi']
   ---
   ```

3. **Write Your Content**: Below the frontmatter, write your article using standard Markdown syntax (`##` for H2, `###` for H3, `*` for lists, etc.).

4. **Add Images**: Place your images in the `/public/images/posts/` directory and reference them in your Markdown like this: `![Alt text for image](/images/posts/my-new-image.jpg)`.

5. **Commit and Push**: Once you are done, commit the new Markdown file and the new image file to your Git repository. If your project is deployed on a service like Vercel or Netlify, this push will automatically trigger a new build and deploy your new article to the live site.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server (you must run `build` first).

## Technology Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS & CSS Modules
- **Content**: Markdown
- **Markdown Parsing**: `gray-matter` & `remark`
