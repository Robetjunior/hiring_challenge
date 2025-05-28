import express, { Request, Response, NextFunction } from 'express';
import { RegisterRoutes } from './routes/routes';
import cors from 'cors';
import { ValidateError } from '@tsoa/runtime';

const app = express();

// Use JSON parser for all non-webhook routes
app.use(express.json());
app.use(cors());

RegisterRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? err.statusCode ?? err.httpStatusCode;

    if (!status || status >= 500) {
        console.error(err);
    }

    if (err instanceof ValidateError) {
        return res.status(400).json({
            message: "Validation Failed",
            details: err.fields,
        });
    }

    if (status === 404) {
        return res.status(404).json({ message: err.message });
    }

    if (status === 400) {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
});

export { app }; 