import { cleanEnv, port, str } from "envalid"; 

export default cleanEnv(process.env,{
    MONGO_CONNECTION_STRING:str(),
    PORT:port(),
    TOKEN:str(),
    VERIFY_TOKEN:str(),
    PASSPHRASE:str(),
    PRIVATE_KEY:str(),
    VERSION:str(),
    PHONE_NO_ID:str(),
    STRIPE_SECRET_KEY:str(),
    BASE_URL:str(),
    STRIPE_END_POINT_SECRET:str(),
    FRONTEND_URL:str()
});