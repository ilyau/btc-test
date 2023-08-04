
```bash
# clone repo
$ git clone https://github.com/ilyau/btc-test.git

$ cd btc-test

# build and run
$ docker build -t btc-test . && docker run --env-file .env -p 8080:3000 btc-test

# test command
$ curl --location --request GET 'http://localhost:8080/'
```
