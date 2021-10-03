---
layout: post
title: MSSQL Server Basics
tags: [microsoft, sql, mssql]
cover:
  image: /images/2021-09-29-mssql-server-basics/cover.jpg
  alt: Server room
  hidden: false
date: 2021-09-29
draft: false
---

In the past couple of weeks I've started to work with Microsoft SQL Server.
I have a pretty good founation of SQL from high school, but I've only used PostgreSQL so far in my carreer.
I collect the snippets I found to be the most useful ones that helped me getting started.

<!--more-->

I've learned SQL the same way as I did HTML, with uppercase letters.
Nowadays if I write it like that it feels like I'm screaming, so I choose to stick with lowercase keywords for it.

I needed to get to know a system that uses MSSQL Server,
so in this post I'm going to focus on getting metadata out and not on the CRUD part.

## Microsoft SQL Server Management Studio (SSMS)

Every time I looked for a bit more advanced thing to ask from the server I found that the
[SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)
is supposed to be able to do it.
Currently I do not have a windows environment for development, so I did not go chose this path.

I prefer writing queries than clicking on UI, to get more easily reproducible evidence of what I got for further reference.

It seems to be the go-to tool to use with MSSQL Server, so I'd recommend you to check it out.

## Run MSSQL Server Localy

Microsoft maintains an official docker image for [mssql server](https://hub.docker.com/_/microsoft-mssql-server),
that's the simplest way to get started.

```bash
# set password, NOTE: if you prepend with a space it won't show up in history in many shells
 PASSWORD='MyStrong!Password'
# Run in Docker
docker run \
  -d \
  --name 'mssql_server' \
  -e 'ACCEPT_EULA=Y' \
  -e "SA_PASSWORD=$PASSWORD" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2019-latest

# Connect to the server with sqlcmd
docker exec -it 'mssql_server' /opt/mssql-tools/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "$PASSWORD"
```

## Common tasks

### List Tables of a Database

`information_schema.tables` stores the table information.

```sql
select * from [MyDatabase].[information_schema].[tables] order by 2,3;
```

Second column is `schema`. Third Column is `table_name`.

### TOP

I'm used to writing the
[top](https://docs.microsoft.com/en-us/sql/t-sql/queries/top-transact-sql?view=sql-server-ver15)
statement  to limit the query esults at the end of the query.
In MSSQL it's right at the start of the `select` statement.

```sql
select top 1000 * from [MyDatabase].[dbo].[Log] order by createDate desc;
```

### Get Indices

I needed to get indexes, and found a
[simple article](https://dataedo.com/kb/query/sql-server/list-all-indexes-in-the-database)
to help me query them.

```sql
select
    i.[name] as index_name
   ,substring(column_names, 1, len(column_names)-1) as [columns]
   ,schema_name(t.schema_id) + '.' + t.[name] as table_view
   ,case when i.[type] = 1 then 'Clustered index'
        when i.[type] = 2 then 'Nonclustered unique index'
        when i.[type] = 3 then 'XML index'
        when i.[type] = 4 then 'Spatial index'
        when i.[type] = 5 then 'Clustered columnstore index'
        when i.[type] = 6 then 'Nonclustered columnstore index'
        when i.[type] = 7 then 'Nonclustered hash index'
        end as index_type
    ,case when i.is_unique = 1 then 'Unique'
        else 'Not unique' end as [unique]
    ,case when t.[type] = 'U' then 'Table'
        when t.[type] = 'V' then 'View'
        end as [object_type]
from sys.objects t
    inner join sys.indexes i on
        t.object_id = i.object_id
    cross apply (
        select col.[name] + ', '
        from sys.index_columns ic
        inner join sys.columns col
            on 1=1
                and ic.object_id = col.object_id
                and ic.column_id = col.column_id
        where 1=1
            and ic.object_id = t.object_id
            and ic.index_id = i.index_id
        order by key_ordinal
        for xml path ('')
    ) D (column_names)
where t.is_ms_shipped <> 1 and index_id > 0
order by i.[name]
```

### List foreign keys

I found a [simple article](https://dataedo.com/kb/query/sql-server/list-foreign-keys) to query all foreign keys in the database.

```sql
select schema_name(fk_tab.schema_id) + '.' + fk_tab.name as foreign_table,
    '>-' as rel,
    schema_name(pk_tab.schema_id) + '.' + pk_tab.name as primary_table,
    substring(column_names, 1, len(column_names)-1) as [fk_columns],
    fk.name as fk_constraint_name
from sys.foreign_keys fk
inner join sys.tables fk_tab
    on fk_tab.object_id = fk.parent_object_id
inner join sys.tables pk_tab
    on pk_tab.object_id = fk.referenced_object_id
cross apply (
    select col.[name] + ', '
    from sys.foreign_key_columns fk_c
    inner join sys.columns col
        on 1=1
            and fk_c.parent_object_id = col.object_id
            and fk_c.parent_column_id = col.column_id
    where 1=1
        and fk_c.parent_object_id = fk_tab.object_id
        and fk_c.constraint_object_id = fk.object_id
    order by col.column_id
    for xml path ('') ) D (column_names)
order by schema_name(fk_tab.schema_id) + '.' + fk_tab.name,
    schema_name(pk_tab.schema_id) + '.' + pk_tab.name
```

### List columns

[sp_columns](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-columns-transact-sql?view=sql-server-ver15)
is a stored proceure that lists column information of the specified objecct.

```sql
exec sp_columns [MyTable];
```

### Use Variables

Sometimes it helps to get data from
[variables](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/variables-transact-sql?view=sql-server-ver15)
into the queries.

```sql
drop table if exists #temptable;

declare @uuid varchar(100);
set @uuid = '123e4567-e89b-12d3-a456-426652340000';

select uuid = @uuid
into #temptable;

select * from #temptable;
GO
```

In this example you can also see the handy `select into` statement,
that inserts the result into a table if the table does not already exists.

#### Get values from freshly modified lines

The
[Output](https://docs.microsoft.com/en-us/sql/t-sql/queries/output-clause-transact-sql?view=sql-server-ver15)
clause can show values for you in the console or store them into variables.

```sql
create table dbo.employees (
    id int identity primary key,
    employee varchar(32));
go

insert into dbo.employees 
output INSERTED.* -- output to console
values
      ('Fred')
     ,('Tom')
     ,('Sally')
     ,('Alice');
go

declare @deletedLinesTableVar table
(
    id int,
    employee VARCHAR(32)
);

print 'employees before deletion';
select * from dbo.employees;

delete from dbo.employees
output DELETED.* into @deletedLinesTableVar -- output into table variable
where id = 4 or id = 2;

print 'employees, after deletion';
select * from dbo.employees;

print '@deletedLinesTableVar, after deletion';
select * from @deletedLinesTableVar;

drop table dbo.employees;
```

The [print](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/print-transact-sql?view=sql-server-ver15)
statement prints values into the console.

### Stored Procedures

Stored procedures are reusable blocks of SQL code that you can run.

#### Get All Defined Stored Procedure Codes

You can
[query the code](https://docs.microsoft.com/en-us/sql/relational-databases/stored-procedures/view-the-definition-of-a-stored-procedure?view=sql-server-ver15)
of the available procedures.

```sql
select [definition]
from sys.sql_modules
where object_id = (OBJECT_ID(N'dbo.myStoredProcedureName'));
```

```sql
SELECT [definition] FROM sys.sql_modules;
```

#### Create and Run a Stored Procedure

```sql
use MyDatabase;
go;
create or alter proc [dbo].[myStoredProcedureName] (
    @message varchar(100)
   ,@debug bit = 0
) as
    set nocount on;
    declare
       @sql nvarchar(max)

    set @sql = concat(
         'select '
        ,@message
     );

     if (@debug = 1)
        print @sql;
     else
        exec sp_executesql @sql;
    ;
go
```

Call it with parameters.

```sql
exec dbo.myStoredProcedureName @message = 'world', @debug = 1;
```

### Show Last Few Queries

Out of this handy MSSQL Server [SQL collection](https://sqlserver-rainorshine.blogspot.com/p/handy-t-sql-queries.html)
I found a useful query to see the last few successful queries.

```sql
select
    deqs.last_execution_time as [Time],
    dest.text as [Query],
    dest.*
from sys.dm_exec_query_stats as deqs
cross apply sys.dm_exec_sql_text(deqs.sql_handle) as dest
--where dest.dbid = DB_ID('msdb')
order by deqs.last_execution_time desc;
```

### Show Connections And Queries

[sp_who](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-who-transact-sql?view=sql-server-ver15)
provides information about current users, sessions, and processes in an instance of the Microsoft SQL Server Database Engine.

```sql
exec sp_who
exec sp_who2
```

`sp_who2` is undocumented and disregarded though used widely, and it provides extra columns and more compact display.

If the `status` shows `SUSPENDED`, then the query might be blocked by a lock.

## Show locks

[sp_lock](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-lock-transact-sql?view=sql-server-ver15)
shoows information about current locks.
It's recommended to use [sys.dm_tran_locks](https://docs.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql?view=sql-server-ver15) for new development.

```sql
exec sp_lock;

-- sys.dm_tran_locks
select resource_type, resource_associated_entity_id,
    request_status, request_mode,request_session_id,
    resource_description
from sys.dm_tran_locks
```

## CLI

[SQLCmd](https://docs.microsoft.com/en-us/sql/tools/sqlcmd-utility?view=sql-server-ver15)
is a command line tool that can be used to connect to MSSQL server, to run scripts from local filesystem.

```sh
sqlcmd -S "devdb.company.com,1433" \
    -d 'MyDatabase' \
    -U 'user' \
    -P "$PASSWORD" \
    -i './my-migration.sql';
```

In case you run the docker version, make sure you add your file as a volume.

### GO Command

[GO](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/sql-server-utilities-statements-go?view=sql-server-ver15)
command signals the end of a batch of Transact-SQL statements to the SQL Server utilities.

## Summary

I hope this collection will be useful for you, and will help me later if I ever need to work with MSSQL again.

Happy coding!

Cover Photo by [Manuel Geissinger](https://www.pexels.com/@artunchained) from [Pexels](https://www.pexels.com/photo/black-server-racks-on-a-room-325229/)
