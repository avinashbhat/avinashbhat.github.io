---
published: false
---
Best way to do this in my opinion is using SQL Loader scripts. They will work best if your database is a huge one, with all the contingencies in place. Since my database was a small one (~30 GBs) I went with this approach, a hacky way, but works well.


I did this using SQL Developer and some Python scripts, and the Python scripts might not be required too. Let's get to it later.

There are multiple ways to go about migration using SQL Developer. 
 - Copying the tables manually
 - Migration Wizard

Here the first way works if you do not want to preserve any Primary Key - Foreign Key relations, and if you need any views, procedures or functions copied, you need to manually copy them.

The second way, is more efficient as in it will copy all the information for a particular table.

There are again two ways about it, 
 - Online Migration
 - Offline Migration

Online Migration generates the migration repository and the moves the data to the given endpoint (Oracle schema). This is suitable for the DBs that have less number of tables and not a lot of data.

Offline Migration generates the migration scripts that is needed to move the DB at a later point. These scripts can be later run when we have an empty schema ready. 

##### Steps Involved

1.	SQL Developer does not have the driver to connect to a MS SQL DB. The driver that I used is the jtds driver (to be more specific jtds-1.2). Download and load the third party driver[2]. 

2.	Once you load the MS SQL Server using the driver, right click on the specific DB you are trying to move. It gives an option to Migrate to Oracle.

![]({{site.baseurl}}/assets/images/2020-09-23-1.png)




