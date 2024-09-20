import axios from "axios";
import { join } from 'path';
import {createReadStream,statSync} from "fs";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ 
    region: "REGION",
    credentials: {
        accessKeyId: "minio_username",
        secretAccessKey: "minio_password",
    }, 
    endpoint: "http://127.0.0.1:9000",
});

const generatePresignedUrl = async (objectKey: string, cmd : "get"| "put"): Promise<string> => {
    const bucketName: string = "miniobucket";
    if (!["get", "put"].includes(cmd)){
        throw "unkdonw cmd option"
    }
    let CmdObj = cmd === "put" ? PutObjectCommand : GetObjectCommand

    const command = cmd === "put" 
        ? new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
          }) 
        : new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
          }) 
        
    try {
      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
      console.log("Presigned URL:", presignedUrl);
      return presignedUrl;
    } catch (err) {
      console.error("Error generating presigned URL:", err);
      throw err;
    }
  };


  const uploadFileWithPresignedUrl = async (presignedUrl: string, filePath: string): Promise<void> => {
    const fileStream = createReadStream(filePath);
    const fileStats = statSync(filePath);
  
    try {
      // Upload the file using PUT request
      const response = await axios.put(presignedUrl, fileStream, {
        headers: {
          'Content-Type': "image/jpeg",
          'Content-Length': fileStats.size,
        },
      });
    
    } catch (error:any ) {
        console.error("ERROR UPLOADING THE IMAGE:")
        if (error.response) {
            console.error(error.response?.data)
            return 
        }else{
            console.log(error)
        }
    }
  };

async function main(){
    const objectKey = "canaglia"
    const uploadUrl = await generatePresignedUrl(objectKey, "put");
    console.log(`uploadUrl: \n`,uploadUrl)
    const imagePath = join(__dirname, "../assets/test.jpeg");
    await uploadFileWithPresignedUrl(uploadUrl, imagePath)
    const getUrl = await generatePresignedUrl(objectKey, "get");
    console.log(`getUrl: \n`,getUrl)
    
}

main()
