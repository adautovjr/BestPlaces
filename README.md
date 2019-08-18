# BestPlaces
Udacity Project

## Requirements

* python 3
* pip 3
* postgresql
* node version 8.9.1
* npm

## Setup
1. Setup ```.env``` file accordingly with yout postgresql user and password

1.1. If you can't remember your postgres credentials, you can reset them by running:
```
$ sudo -u postgres psql

$ =>\password
```
2. Run the code below to install all the dependencies
```
$ pip3 install -r requirements.txt
```

2.1. Note: if you encounter issues when running this code you're required to run each line of ```requirements.txt``` as show below:
```
$ pip3 install [module_name] --user
```

## Usage
Execute the code below to run the server on http://localhost:5000
```
$ python3 app.py
```
Then go to ```front\best-places\``` and execute the code below to run the node.js webserver, then access http://localhost:3000
```
$ npm install

$ npm start
```
