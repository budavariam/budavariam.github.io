FROM ruby:2.6.3-alpine
LABEL maintainer='Mátyás Budavári <budavariam@gmail.com>'

ENV GHP_GEM_VERSION 197

RUN apk --update add --virtual build_deps \
      build-base ruby-dev libc-dev linux-headers && \
    gem install --no-document github-pages:${GHP_GEM_VERSION} && \
    apk del build_deps && \
    rm -rf /usr/lib/ruby/gems/*/cache/*.gem

EXPOSE 4000

CMD ["jekyll", "serve","--host=0.0.0.0"]