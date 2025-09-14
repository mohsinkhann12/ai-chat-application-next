# AI Chat Application

A modern, feature-rich chat application built with Next.js and TypeScript that enables interactive conversations with an AI assistant. The application provides a clean, intuitive interface with support for multiple chat sessions and customizable themes.

## Features

- 💬 Multiple chat conversations support
- 🎨 Light/Dark/System theme support
- 📱 Responsive design
- 💾 Local storage persistence
- ⌨️ Markdown support in messages
- ⚡ Real-time AI responses
- 🔄 Loading states and typing indicators
- 📜 Scrollable chat history

## Tech Stack

- **Framework**: Next.js with TypeScript
- **UI Components**: Custom components built with Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks with Local Storage
- **AI Integration**: GROQ API
- **Icons**: Lucide Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   Create a `.env.local` file with your API keys

4. Run the development server:
   ```bash
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/               # Next.js app directory
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── ...           # Feature-specific components
├── lib/              # Utility functions and API clients
├── public/           # Static assets
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Features in Detail

### Chat Interface
- Real-time message sending and receiving
- Markdown rendering support
- Automatic scroll to latest messages
- Loading states and typing indicators
- Avatar support for user and AI messages

### Theme Support
- Light and dark mode support
- System theme detection
- Persistent theme preference

### Storage
- Local storage for chat history
- User preferences persistence
- Sidebar state persistence

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.
