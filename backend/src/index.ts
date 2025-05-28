import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import * as swaggerJson from '../public/swagger.json';
import { seedDatabase } from './config/seed';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
const swaggerDocument = swaggerJson as any;
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      docExpansion: "none",
    },
  })
);
app.get('/docs', swaggerUi.setup(swaggerDocument) as any);

// Register TSOA routes
RegisterRoutes(app);

// Initialize database
AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        
        // Seed database with demo data
        await seedDatabase(AppDataSource);
        
        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`API is available at: http://localhost:${port}`);
            console.log(`Swagger documentation is available at: http://localhost:${port}/docs`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    }); 