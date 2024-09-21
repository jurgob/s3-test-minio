# S3 Test minio

this is a simple examplle of how to make a simple server / sli tool to generate s3 locally using minio

# install

```sh
npm i
```

# run it

## server

just run 

```sh
npm run dev
```

then go with your browser into:  ```http://localhost:3000/api/urls/yourkey```


the dev script will automatically spin up minio and create a default bucket usind docker compose

## test from cli
you need first to spin up your server wich

```sh
npm run start:db
```

then run the cli script with

```sh
npm run cli
```

if you go with your browser in the get url, you will see the image







