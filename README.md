# CCBackend

Greetings, this is the backend api node Api I've made to keep track of my MTG collection and thought some people might find it useful.

Huge thanks go out to MTG Json as they provide all the data. 

Things I still need to add are:
  -Custom Tags (For binders and decks)
  -I need to add a settings pannel to the frontend to interact with the backend, perhaps I store these settings on the database? This will require some thought.
  -I'll add a licence thats open source like MIT or APACHE
  -Documentation for API endpoints
  
You'll need to add a .env file with DATABASE_CONNECTION_STRING=<Your mongodb connection string>. This all fits inside a free cluster in mongodb Atlas and my goal is to make sure it will always fit in. But we shall see, at the rate of secret lairs we never know.

Hope someone uses this, if you want more things added just add a issue and I'll see if I can add it.

  npm start
