import axios from "axios";
import {createReadStream,statSync} from "fs";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { stat} from "fs/promises";
import { Readable } from "node:stream";

const s3Client = new S3Client({ 
    region: "REGION",
    credentials: {
        accessKeyId: "minio_username",
        secretAccessKey: "minio_password",
    }, 
    endpoint: "http://127.0.0.1:9000",
});

export const generatePresignedUrl = async (objectKey: string, cmd : "get"| "put"): Promise<string> => {
    const bucketName: string = "miniobucket";
    if (!["get", "put"].includes(cmd)){
        throw "unkdonw cmd option"
    }
    let CmdObj = cmd === "put" ? PutObjectCommand : GetObjectCommand

    const commandOptions = {
        Bucket: bucketName,
        Key: objectKey,
      }

    const command = cmd === "put" 
        ? new PutObjectCommand(commandOptions) 
        : new GetObjectCommand(commandOptions) 
        
    try {
      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
      console.log("Presigned URL:", presignedUrl);
      return presignedUrl;
    } catch (err) {
      console.error("Error generating presigned URL:", err);
      throw err;
    }
  };


export  const uploadFileWithPresignedUrl = async (presignedUrl: string, filePath: string): Promise<void> => {
    const fileStream = createReadStream(filePath);
    const fileStats = await stat(filePath);

    await uploadStream(presignedUrl, fileStream, fileStats.size.toString(), "image/jpeg")

};

export  const uploadStream = async (presignedUrl: string, readStream: Readable, contentLength: string, contentType: string): Promise<void> => {
  try {
    const response = await axios.put(presignedUrl, readStream, {
      headers: {
        'Content-Type': "image/jpeg",
        'Content-Length': contentLength,
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
      throw error;
  }
};