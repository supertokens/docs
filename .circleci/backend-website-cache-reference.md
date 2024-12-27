# Cache Reference

This file is used to invalidate the Circle CI cache that holds the `supertokens-backend-website-repository`.
We use a cache because the repository is large and the clone process takes a lot of time.

If the checksum of this file doesn't change, the CI process performs a `git pull` at the start of the job.
Otherwise a `git clone` will be performed.

If you want to invalidate the cache just increment the next line.
0
