# PLP Telegram Manager

A web-based platform for managing and analyzing Telegram group messages, photos, and attachments.

## Features

- 📱 **Telegram Integration**: Automatically collect messages from multiple groups
- 💾 **Message Archive**: Store and search all group messages
- 🖼️ **Media Management**: Handle photos, videos, and documents
- 📊 **Analytics**: Track group activity and user engagement
- 🔐 **Secure**: Role-based access control
- 🚀 **Real-time**: Live updates via webhooks

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Bot**: Telegraf (Telegram Bot Framework)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Telegram Bot Token (from @BotFather)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/plp-telegram-web.git
cd plp-telegram-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
DATABASE_URL="postgresql://user:password@host:port/database"
TELEGRAM_BOT_TOKEN="your-bot-token"
NEXTAUTH_SECRET="generate-a-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. In another terminal, run the bot in development mode:
```bash
npm run bot:dev
```

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run bot:dev` - Run Telegram bot in polling mode
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema changes to database
- `npm run build` - Build for production
- `npm run start` - Start production server

### Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── (auth)/          # Authentication pages
│   └── (dashboard)/     # Dashboard pages
├── components/          # React components
├── lib/                 # Utility functions
│   ├── telegram/        # Telegram bot logic
│   └── db.ts           # Database client
├── prisma/             # Database schema
└── public/             # Static assets
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Set up Webhook (Production)

After deployment, set up the Telegram webhook:

```bash
WEBHOOK_URL="https://your-domain.vercel.app/api/telegram/webhook" npm run webhook:setup
```

## Usage

1. **Add Bot to Group**: Add @plp_telegram_bot to your Telegram group
2. **Grant Admin Rights**: Make the bot an admin (optional, for full features)
3. **Start Collecting**: The bot will automatically start collecting messages
4. **Access Dashboard**: Login to the web dashboard to view and manage messages

## API Endpoints

- `POST /api/telegram/webhook` - Telegram webhook endpoint
- `GET /api/groups` - List all groups
- `GET /api/messages` - Get messages (with filters)
- `GET /api/analytics` - Get analytics data

## Security

- All API routes are protected with authentication
- Role-based access control (Admin, Moderator, Viewer)
- Encrypted database connections
- Secure file storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@plp.org or join our Telegram group.