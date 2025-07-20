import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the GenAI instance
const genAI = new GoogleGenerativeAI(apiKey);

// Get the model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Generation config
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};
const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

// Start chat session
export const chatSession = model.startChat({
  generationConfig,
  history: [],
});


export const GenAiCode = model.startChat({
  generationConfig: CodeGenerationConfig,
  history: [
    {
      role: 'user',
      parts:[
        {text: 'Generate a modern and production-ready React project using Vite. Before generating files, **remove any existing code or files** — start fresh with a clean structure. Organize reusable components into folders using only .js file extensions (no .jsx or .ts). Style the entire project using Tailwind CSS only. Do not include any third-party UI libraries or frameworks. For icons, only use the "lucide-react" package and only from this list: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, ArrowRight. Example: ,import :{ Heart } ,from ,"lucide-react" '}
      ],
    },
    {role: 'model',
      parts: [
        {text: '```json\n{\n  \"projectTitle\": \"React Project\",\n  \"explanation\": \"A modern and production-ready React project using Vite, styled with Tailwind CSS, and using the specified icons from lucide-react.\"\n} Sure! I can help you with that. Let me generate the code for a modern React project using Vite, styled with Tailwind CSS and using the specified icons from lucide-react.```'}
      ]
    }
  ],
})