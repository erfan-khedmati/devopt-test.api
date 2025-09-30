import express from "express";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5137',
      'http://localhost:5173',
      'http://127.0.0.1:5137',
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
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

app.get('/api/users', (req, res)=> {
    res.json(users);
})

app.get("/api/health", (req, res)=> {
    res.json({message: "backend is running"});
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`));