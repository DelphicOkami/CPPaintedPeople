# CP Painted People
This contains the pages for the Fir Cruthen faction at Curious Pastimes LARP

## How to add entries
Each page on the site is governed by its `page.json` file (under pages), this lists what entries
are on the page and who authored them, the content field should point to a markdown file
containing the data for the entry.

If you don't supply an author then it defaults to Anonymous, if you don't want it signed you
can add `"unsigned": true` to the relevant entry.  

NB: I advise looking at pages/who-are-we for a good solid example of how to add entries

### To add a new page
Create a directory for it under pages, create a `pages.json` and add an entry to the `menu.json`
file, this renders the menu at the top of the screen. I designed this to be self-explanatory but
if not here goes, the top level items are rendered on the menu bar, any `entries` in these are 
rendered in the drop down menus. All `urls` are paths relative to the `pages/` directory

## Testing / checking your entry
If you install the NPM packages for this it will install local-web-server which you can execute with 
`node_modules/.bin/ws` this will run a web server on your machine and you can easily go to 
http://localhost:8000 and it will show you your version of the site