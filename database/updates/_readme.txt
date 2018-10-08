
update file should be named
"update_x[xx].js"
any supporting files it loads should be placed in files directory named:
"update_x[xx]_x.js" so they're easy to find

The updates should go sequentially, 1,2,3, etc. If 2 people have updates at the same time, the second PR to merge will have a merge conflict and that guy will need to bump up his number.

The database version starts at 0, and the updates start at 1, all updates are integral, no 1.5 or so and once database is at version 5, will only run versions greater than that.



