FROM ruby:2.6.3
LABEL maintainer='Mátyás Budavári <budavariam@gmail.com>'

RUN apt-get update && \
	gem install bundler -v 1.12.3 && \
    gem install github-pages

EXPOSE 4000

CMD ["jekyll", "serve","--host=0.0.0.0"]