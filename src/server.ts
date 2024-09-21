import express, { Request, Response } from 'express';
import cors from 'cors';
import { generatePresignedUrl } from ".";
import { error } from 'console';

// Create an Express application
const app = express();

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
        res.status(500)
        res.json({
            status: 500, 
            error: e
        })
    }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});