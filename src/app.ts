import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import webhookRoutes from "./routes/webhook";
import flowRoutes from "./routes/flow";
import mediaRoutes from "./routes/media";
import stripeRoutes from "./routes/stripe";
import embeddedSignupRoutes from "./routes/embedded-signup";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

/**
 * ✅ CORS - allow ALL origins (no restriction)
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * ✅ Handle Stripe webhook separately (raw body required)
 */
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.originalUrl === "/stripe/webhook") {
    next(); // raw body (handled inside route if needed)
  } else {
    bodyParser.json()(req, res, next);
  }
});

/**
 * ✅ Routes
 */
app.use("/webhook", webhookRoutes);
app.use("/flow", flowRoutes);
app.use("/media", mediaRoutes);
app.use("/stripe", stripeRoutes);

app.use("/api/notes", notesRoutes);
app.use("/api/embedded-signup", embeddedSignupRoutes);

/**
 * ✅ Health check
 */
app.use("/", (req, res) => {
  res.status(200).json(`server running on ${process.env.PORT}`);
});

/**
 * ❌ 404 handler
 */
app.use((req, res, next) => {
  next(new Error("End point not found"));
});

/**
 * ❌ Global error handler
 */
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("# error start #");
  console.error(error);
  console.error("# error end #");

  let errorMessage = "An unknown error occurred";

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  res.status(500).json({ error: errorMessage });
});

export default app;
