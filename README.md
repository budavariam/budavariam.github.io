# My personal site

Hello, I'm Mátyás Budavári, and you're looking at the source of my personal site.

You can see it LIVE on [github pages](https://budavariam.github.io).

## Local Development

1. Install Jekyll and plug-ins in one fell swoop. `gem install github-pages` This mirrors the plug-ins used by GitHub Pages on your local machine including Jekyll, Sass, etc.
2. Clone down your fork `git clone https://github.com/yourusername/yourusername.github.io.git`
3. Serve the site and watch for markup/sass changes `jekyll serve`
4. View your website at http://127.0.0.1:4000/
5. Commit any changes and push everything to the master branch of your GitHub user repository. GitHub Pages will then rebuild and serve your website.

## Compress images

Install [jpegoptim](https://github.com/tjko/jpegoptim) to compress your images, not to fill this repo unnecessarily.

## Docker

You can set the development environment up locally easier with docker.
Run `docker-compose up`, wait until you see that *the server is running*,
navigate to [localhost:4000](localhost:4000).
You can edit the content and changes trigger regeneration.
