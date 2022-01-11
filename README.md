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

# Routes
  The following are all the routes that I am working on, and more or less what they do.
## Brew
  This is WIP but the idea is to be able to brew decks and view stats on the decks, check rulings and so on.
## Card
  This is the Main database endpoint, this is where you can add cards to the database, this follows the card.js model, this model looks quite similar to the MTG json card model.
## Info
  This endpoint gets the meta information of the dataset, when it was last updated an so on, this meta information will follow MTG json's
## Roll
  This is a new endpoint and is still being worked on, at the moment it has flip funtionality, for example when you use krark's thumb and need to flip 5 coins, this will just tell you how many wins you got.
## Update
  This also works hand in hand with the card and meta endpoints, these will update the dataset.
