import express, { Request, Response } from 'express';
import cors from 'cors';
import { generatePresignedUrl, uploadStream } from ".";
import axios from 'axios';
import { Readable } from 'stream';

const app = express();
type HTTPError = {
    status: number,
    message: string,
    example?: string
}
app.use(cors());
app.use(express.json());

app.get('/api/urls/:key', async (req: Request, res: Response) => {
    try{
        const {key} = req.params;
        const [put, get] = await Promise.all([
            generatePresignedUrl(key, "put"),
            generatePresignedUrl(key, "get"),
        ])

        res.json({
            put:put,
            get
        });

    }catch(e){
        httpError(res, e);
    }
});

// add an endpoit /api/upload/images/:key/:url which genereate a get presigned url and upload the image to the presigned url and return the get presigned url
app.get('/api/uploads/images', async (req: Request, res: Response) => {
    
    try{
        const { url , key} = req.query;
        console.log({ url , key})
        if (!url || typeof url !== 'string') {
            throw {
                status: 400,
                message: 'The url query parameter is required',
                example: '/api/uploads/images?key=example&url=https://example.com/image.jpg'
            } as HTTPError;
            throw new Error('The imageUrl query parameter is required');
        }
        if (!key || typeof key !== 'string') {
            throw {
                status: 400,
                message: 'The key query parameter is required',
                example: '/api/uploads/images?key=example&url=https://example.com/image.jpg'
            } as HTTPError;
        }

        const [put, get] = await Promise.all([
            generatePresignedUrl(key, "put"),
            generatePresignedUrl(key, "get"),
        ])
        
        // download the content of the imageUrl param and put it in a readable stream. check the content type is an image. retrive the content length and put it in a variable
        const response = await axios.get(url, { responseType: 'stream' });
        const contentType = response.headers['content-type'];
        const contentLength = parseInt(response.headers['content-length'], 10);

        if (!contentType.startsWith('image/')) {
            throw new Error('The URL does not point to an image');
        }
        const imageStream = response.data as Readable;
        await uploadStream(put, imageStream, contentLength.toString(), contentType);


        res.json({
            key,
            contentType,
            contentLength,
            imageUrl: url,
            getUrl: get
        });

    }catch(e){
        httpError(res, e)
    }
});

const httpError = (res: Response, err: unknown) => {
    console.error(`ERROR: `, err);
    if(err 
        && typeof err === "object" 
        && "status" in err
        && "message" in err
        && "example" in err){
        const _err = err as HTTPError;
        
        res.status(_err.status)
        return res.json({
            message: _err.message,
            example: _err.example, 
        });
    }else {
        res.status(500)
        return res.json({
            status: 500, 
            message: err?.toString()
        });
    }
};

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});