import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import webhookRoutes from "./routes/webhook";
import flowRoutes from "./routes/flow";
import mediaRoutes from "./routes/media";
import stripeRoutes from "./routes/stripe";
import embeddedSignupRoutes from "./routes/embedded-signup";
import cors from "cors";
import bodyParser from 'body-parser';


const app = express();

app.use((req: express.Request,res: express.Response,next: express.NextFunction): void => {
    if (req.originalUrl === '/stripe/webhook') {  
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  }
);

//this for testing embededsignup in the local envirnment 
app.use(cors({origin:`${process.env.FRONTEND_URL}`,credentials:false,methods:"GET,HEAD,PUT,PATCH,POST,DELETE"}))


app.use("/webhook",webhookRoutes);
app.use("/flow",flowRoutes);
app.use("/media",mediaRoutes);
app.use("/stripe",stripeRoutes);

//to handle any frontend calls 
app.use("/api/notes",notesRoutes);
app.use("/api/embedded-signup",embeddedSignupRoutes)


app.use("/",(req,res)=>{
  res.status(200).json(`server running on ${process.env.PORT}`)
});

app.use((req,res,next)=>{
  next(Error("End point not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown,req:Request,res:Response,next:NextFunction)=>{
  console.error("# error start #");
  console.error(error);
  console.error("# error end #");
  let errorMessage="An unknown error occured";
  if(error instanceof Error){
    errorMessage=error.message;
    res.status(500).json({error:errorMessage});
  }
});

export default app;