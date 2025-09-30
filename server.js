import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS configuration for Docker environment
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5137',
            'http://localhost:5173',
            'http://localhost:4173',
            'http://127.0.0.1:5137',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:4173',
            'https://your-domain.com',        // Your production domain
            'http://frontend:4173',           // Docker internal
            'http://frontend-app:4173'        // Docker container name
        ];

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

let users = [
    { id: 1, name: "erfan", age: 19 },
    { id: 2, name: "maha", age: 19 }
];

app.get('/api/users', (req, res) => {
    console.log('GET /api/users - Returning users:', users);
    res.json(users);
});

app.get("/api/health", (req, res) => {
    res.json({ message: "backend is running", timestamp: new Date().toISOString() });
});

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend API is working!', environment: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});