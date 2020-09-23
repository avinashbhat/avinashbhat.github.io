---
published: false
---
This is a growing list, includes the SQL that I use almost on a daily basis.

##### Get all the duplicate rows in a table, sorted by count
```SQL
select * from (SELECT st.sample_table_id,
    COUNT(*) OVER (PARTITION BY sample_table_id) c
FROM sample_table st) order by c desc;
```

##### Delete rows which are indistinguishable 
```SQL
select rowid, sample_table_id from sample_table where sample_table_id in (<list>);
```