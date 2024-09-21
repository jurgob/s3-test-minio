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

if you want to upload an image, use the `/api/uploads/url`. e.g: 

```http://localhost:3000/api/uploads/images?key=cat1&url=https://static.boredpanda.com/blog/wp-content/uploads/2018/04/5acb63d83493f__700-png.jpg```

then go to the get url


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







