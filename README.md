# DeadServerTracker
DeadServerTracker (which needs a better name, ha) pings the specefied hosts every specefied amount of minutes. When the host is dead, it adds it to the database (MongoDB), and sends a text using Tiwlio to the specefied cell number.

## How to run & config
Download or clone this repository
Open `auth.json` and `hosts.csv` and configure them to your needs
`npm install`
Okay good! You got the dependencies installed and the configurations done. Now its time to run it.
There are two required arguments for running this, the CSV file name, and how many minutes you want it to wait before checking for dead servers.
`node index.js hosts.csv 5`
That command runs the tracker, uses the hosts from hosts.csv, and pings every 5 minutes.


Alex Munoz
2022
