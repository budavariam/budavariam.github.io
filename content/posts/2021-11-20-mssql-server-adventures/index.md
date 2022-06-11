---
layout: post
title: MSSQL Server Adventures
tags: [microsoft, sql, mssql]
cover:
  alt: Server room
  hidden: false
resources:
  - name: cover
    src: cover.jpg
date: 2021-11-20
draft: false
---

As I wrote in my [last](../../../../2021/09/29/mssql-server-basics/) post, I've been working closely with Microsoft SQL server for a while now.
Since then I've found some more tricks that made my life easier.

<!--more-->

I've come to realize in the past 2 months that the documentation is pretty thorough.
So in this post I'll include them in the relevant parts.
I don't plan on explaining these parts in depth, the docs do it better than I would.
I'd rather share some more code that made my work simpler.

## Validate data before running a costly query

In the folowing snipped I run a validation code and print a meaningful message, if it fails.

```sql
declare id int = 42;

if exists(select * from str_table where try_convert(float, Cost) is null and Cost is not null)
begin
  raiserror(
    N'Failed to convert a Cost to number for ID: %d (for more details run: select * from huge_str_table where try_convert(decimal(18, 4), DetailLineAmt) is null and DetailLineAmt is not null)' -- Message text
    ,16  -- Severity
    ,1   -- State
    ,@id -- Message Parameters
  );
end
```

Here I used the [raiserror](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/raiserror-transact-sql) statements. In the it's stated, that new applications should use [throw](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/throw-transact-sql) instead of it.
I used `raiserror` because `throw` does not support custom messages, but the variables that I set up with formatmessage show up as empty messages in my database query tool during development.

The `N''` prefix at the start of the message indicates that it's an nvarchar, so it can contain unicode characters.

The [exists](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/exists-transact-sql) statement checks whether a given statement has any results.

The `if` statement can run a block of code that starts with `begin` and ends with `end`. It can only have a single `else` statment.
If you need more elif branches you have to nest `if-else` constucts in the proper branches.

You can set a [severity](https://docs.microsoft.com/en-us/sql/relational-databases/errors-events/database-engine-error-severities) for your messages with raiserror, throw will set it automatically to 16, except if you re-throw an exception in a catch statement.

The `State` is useful if the same user-defined error is raised at multiple locations. It can be between 1-255. It can help find which section of code is raising the errors.

The [error codes](https://docs.microsoft.com/en-us/sql/relational-databases/errors-events/database-engine-events-and-errors) under 50000 are reserved for system errors. `Throw` can not send these system messages, while `raiserror` can.

## Reusing code

During this few months I've been investigating many questions about the data, its validity,
and extracted information to business-related questions.
Since we were in a hurry I often found myself running the same queries all over again.
When I needed to type the same joins for at least 5 times, and they got lost in my console I stopped and tried to automate them,
because I was fairly confident that they will come up again later.

These constructs were really helpful, their concepts were not new to me.
I just want to keep their syntax over here for a quick reference and what point out what makes them different.

When I created these views, functions, and procedures SSMS set me these values. I'll exclude them from my examples, but I used them.

```sql
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
```

### Views

When I did not need any dynamism [views](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql) were my go-to choice.
You can think of views as saved sql statements.

```sql
create or alter view ActiveCustomers
AS
    select
        *
    from dbo.Customers
    where isDeleted <> 0
    ;
GO

-- select * from ActiveCustomers;
```

The `or alter` part helped me during development, because I did not need to drop and recreate the views every time.

### Functions

User defined [functions](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-function-transact-sql) (UDF) are similar to views, but they have 2 main differences that were relevant for me.

- they can receive parameters
- they can return scalar values instead of tabular data

```sql
create or alter function fnCheckBalanceAbove
(
   @lowerBound float
)
returns @table table (
     CalcTime datetime2(7)
    ,CompanyID int
)
as
begin

insert into @table (
     CalcTime
    ,CompanyID
)
select
    getutcdate() [CalcTime]
    CompanyID
from Company
where Balance >= @lowerBound
;

return;
end
;
go
-- select * from fnCheckBalanceAbove(50000)
```

The function can return inline valued table by just wrapping the select into the `return` statement,
but I find it valuable to define the columns that are going to be returned for better readability.

You can use multiple queries to fill the defined result table.

Do not forget that the function must end with a `return` statment.

The huge benefit of funtions, is that their results can be joined to other queries, thus potentially simplify and shorten their code significantly.

### Stored procedures

When you need to run many operations,
you can use [stored procedures](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-procedure-transact-sql).

You can use parameters just like for functions, but you can do even more things:

- use a larger set of constructs like `try-catch` blocks
- call other stored procedures
- return multiple resultsets

You can not use them inside queries, you need to call them with `exec` statement.

```sql
create or alter proc GetTopNCustomers (
   @limit int
)
as
begin
    select top(@limit)
         c.ID
        ,c.Balance
    from Customer c
    order by Balance desc
    ;
end
;
GO

-- exec GetTopNCustomers @limit = 15;
```

I advise agains returning multiple result sets if you'd like to store the results somewhere and not just debugging data, because it's a bit tricky to store the results from a stored procedure call with `insert into`.
You need to have a table that you query the data into.

See this code for example [from](https://www.sqlmatters.com/Articles/sp_who2%20-%20filtering%20and%20sorting%20the%20results.aspx):

```sql
CREATE TABLE #sp_who2 (SPID INT,Status VARCHAR(255),
      Login  VARCHAR(255),HostName  VARCHAR(255),
      BlkBy  VARCHAR(255),DBName  VARCHAR(255),
      Command VARCHAR(255),CPUTime INT,
      DiskIO INT,LastBatch VARCHAR(255),
      ProgramName VARCHAR(255),SPID2 INT,
      REQUESTID INT)
INSERT INTO #sp_who2 EXEC sp_who2
SELECT      *
FROM        #sp_who2
-- Add any filtering of the results here :
WHERE       1=1
    and DBName <> 'master' 
    and HostName like '%'
-- Add any sorting of the results here :
ORDER BY    DBName ASC

DROP TABLE #sp_who2
```

## Summary

I hope you found this collection as useful as I did.

Happy coding!

Cover Photo by [Manuel Geissinger](https://www.pexels.com/@artunchained) from [Pexels](https://www.pexels.com/photo/black-server-racks-on-a-room-325229/)
