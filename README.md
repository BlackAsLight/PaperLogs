# PaperLogs

This Node.JS program consolidates logs that happened on the same day. Consolidating all the files from the same day into one file saves very little disk space. An insignificant amount really, but does cut down on how many you have to scroll through.

These files must start with the format YYYY-MM-DD and end with ".log.gz" Anything can be between that, but do note files on the same day will be consolidated  alphabetically.

## Instructions

### Setup

1. Download this program onto the computer you wish to use it on.
2. Open up a terminal and direct yourself to the downloaded folder's contents using `cd`.
3. Type `npm run build` to install the necessary dependencies and compile the program.

### Run

 - Type `node main.js <path>` to execute the program.
 - Replace `<path>` with the path to the folder that you'd like this program to run on.
 - You can do multiple `<path>` after `node main.js` if there are multiple folders you wish to have consolidated.
   - Example: `node main.js <path1> <path2> <path3>`
