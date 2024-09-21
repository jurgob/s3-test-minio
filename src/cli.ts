import { generatePresignedUrl,uploadFileWithPresignedUrl } from ".";
import { join } from 'path';


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
