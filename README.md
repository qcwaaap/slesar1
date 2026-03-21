## Quick commands

For faster local workflow and deployment use scripts from the `scripts` folder:

```bash
npm run dev:quick          # install deps (if needed) + run dev server
npm run start:quick        # install deps (if needed) + build + start prod server
npm run logs               # realtime all logs from server
npm run logs:backend       # realtime backend/api logs
npm run logs:frontend      # realtime frontend logs
npm run deploy:rsync       # rsync deploy to VPS + remote restart
npm run deploy:server      # deploy to VPS over SSH (default deploy target)
npm run deploy:netlify     # production deploy to Netlify
npm run deploy:vercel      # production deploy to Vercel
```

Or run scripts directly:

```bash
./scripts/dev.sh
./scripts/start.sh
./scripts/logs.sh
./scripts/logs.sh backend
./scripts/logs.sh frontend
./scripts/deploy-rsync.sh
./scripts/deploy.sh
./scripts/deploy.sh server
./scripts/deploy.sh netlify
./scripts/deploy.sh vercel
```

## Getting Started

Run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
