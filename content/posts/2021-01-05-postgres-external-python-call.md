---
layout: post
title: Postgres External Python Call
tags: [ programming, database, postgres, sql, python, docker ]
date: 2021-01-05
---

After [experiencing the awesomeness](/posts/2020/12/30/external-function-from-snowflake/)
of External Calls in Snowflake
I decided to look into the possibilities of running external snippets from Postgres.
<!--more-->
I did not need to search too much to find out that it supports external calls to other languages
beside SQL and C, called [Procedural Languages](https://www.postgresql.org/docs/13/xplang.html).

Out of the documented languages I choose
[Python](https://www.postgresql.org/docs/13/plpython-python23.html) to experiment with.

## Create a docker image with Python and the extension

You must install `python3` and `plpython3` explicitly.
The rest is not mandatory, it would be inherited from the original image.

```dockerfile
FROM postgres:12

RUN apt-get update
RUN apt-get -y install python3 python3-pip postgresql-plpython3-12

RUN  apt-get clean && \
     rm -rf /var/cache/apt/* /var/lib/apt/lists/*

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 5432
CMD ["postgres"]
```

### Note about python3 version

The postgres image is based on a slim debian image.
In case you need a specfic version combination,
or a shiny new python version you might have a hard time.

If the docker postgres image starts from a debian version that do not officially support
the necessary python version, you need to figure out a suitable way to get it done.

One way is to build python from its source code, and to make sure that it is really used by plpython3u.

Another way would be to start from an os image (like a newer debian) and install postgres and python as well.
And make sure that your code does all the things that the base postgres image would do, to achieve better compatibility.

Some of the current latest version combnations:

- postgres:11 (stretch) installs python3.5.3
- postfres:12 (buster) installs python3.7.3
- postgres:13 (buster) installs python3.7.3

## Create a stored procedure in Python

Before you can start to work on your python code you need to enable
the python language extension by running the following code once.

```sql
-- need to call it once
CREATE EXTENSION plpython3u;
```

If the environment is ready you can create your python code wrapped in a stored procedure.
[Official docs](https://www.postgresql.org/docs/13/plpython-funcs.html).

```sql
-- DROP FUNCTION hello_world;
-- define incoming parameters with type
CREATE FUNCTION hello_world (how text)
  RETURNS table (
    -- return row definition
    index      integer,
    greeting   text
  )
AS $$
  -- add any python code here
  for index, who in enumerate([ "World", "PostgreSQL", "PL/Python" ]):
    yield ( index, f"{how} {who}!" )
  -- end of python code
$$ LANGUAGE plpython3u;
```

### Use custom python libraries

You can import python libraries in your code as well.
In case you use it in an orchestrated environment e.g: [kubernetes](https://kubernetes.io/),
you'll need to make sure that the install directory is persisted.

You can install them manually inside the docker image (`docker exec`),
or ship the docker image with the libs preinstalled (`RUN pip3 install mylib`).
It depends on your constraints of what might be a better option.

#### Manual install

The database does not need to be stopped, though the defined function
won't be available while you switch the two lib versions.

It might be the better choice while you need quick iterations,
or you just like to get your hands dirty or you develop a custom lib just to use its code from postgres.

#### Shipped install

You need to specify the lib version in the docker image, run `pip install -r requirements.txt`
and ship a new version.

It might be the better choice if your database don't have internet access,
or you need to specifically keep track of the different version combinations.

## Call the stored procedure

You can call the stored procedure in the from clause.

```sql
select * from hello_world('Hello');
--  index |     greeting
-- -------+-------------------
--      0 | Hello World!
--      1 | Hello PostgreSQL!
--      2 | Hello PL/Python!

select greeting from hello_world('Goodbye');
--       greeting
-- ---------------------
--  Goodbye World!
--  Goodbye PostgreSQL!
--  Goodbye PL/Python!
```

## Access the database

In case you need to get/set data in database you can connect to it from python code with the `plpy` module.

```sql
CREATE FUNCTION try_adding_joe() RETURNS text AS $$
    try:
        plpy.execute("INSERT INTO users(username) VALUES ('joe')")
    except plpy.SPIError:
        return "something went wrong"
    else:
        return "Joe added"
$$ LANGUAGE plpython3u;
```

For more info see the [official docs](https://www.postgresql.org/docs/13/plpython-database.html).

## Beware, it's untrusted

Before you rush to use it in your production app, I advise you, to evaluate the security risks it can add to your database.

You might've noticed the `u` at the end of `plpython3u`. Its meaning is defined in the [official docs](https://www.postgresql.org/docs/12/plpython.html#docComments):

> PL/Python is only available as an "untrusted" language, meaning it does not offer any way of restricting what users can do in it and is therefore named plpythonu.
> ...
> The writer of a function in untrusted PL/Python must take care that the function cannot be used to do anything unwanted,
> since it will be able to do anything that could be done by a user logged in as the database administrator.
> Only superusers can create functions in untrusted languages such as plpythonu.

Happy Coding!
