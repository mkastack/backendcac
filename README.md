# CAC Bubiashie Central - Church Management Platform

Welcome to the **CAC Bubiashie Central** full-stack church management platform. This project provides a beautiful, modern, and highly-responsive frontend web application integrated with a Supabase backend to handle real-time data for the church congregation.

---

## 🚀 Features

### Public Portal
- **Dynamic Events:** Browse upcoming church events, conferences, and retreats. Features an integrated newsletter subscription.
- **Sermon Library:** Listen or watch archived sermons indexed by speaker, series, and format.
- **Prayer Wall:** Submit prayer requests and share testimonies of what God has done.
- **Online Giving:** Make secure tithes and donations directed towards specific church funds.
- **Blog & News:** Stay updated with the pastor's desk, community outreaches, and youth programs.

### Admin Console
- **Real-Time Dashboard:** Overview of church metrics, incoming donations, pending prayer requests, and member growth with a live notification feed.
- **Member Directory:** A fully integrated table managing church members, allowing creates, updates, and deletes.
- **Content Management:** Admins can securely publish new blog posts, upload sermon metadata, and manage event schedules.
- **Prayer Triage:** Efficiently read, update the status, and track weekly statistics of submitted prayer requests and testimonies.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Realtime, Row Level Security)
- **Routing:** React Router DOM
- **Icons:** Google Material Symbols

---

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with an active [Supabase](https://supabase.com/) project.

### Environment variables
Create a `.env.local` file at the root of your project based on the keys provided by your Supabase project:
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Installation
Run the following commands to get started:

```sh
# Install all required dependencies
npm install

# Start the local development server
npm run dev
```

The application will typically be available at `http://localhost:8080`.

---

## 📜 Deployment

The application is configured to be seamlessly deployed via platforms like **Vercel** or **Netlify**. Ensure your environment variables are configured in the provider's production settings.

---

*For technical support or issues, please contact the administrative development team.*
