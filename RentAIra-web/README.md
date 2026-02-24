# RentAIra - Smart Renting Made Simple

RentAIra is a modern, AI-powered property management and rent-sharing platform designed to make the renting experience seamless for both tenants and landlords. Built with a "Human-Centered" design philosophy, it combines cutting-edge technology with an intuitive, trustworthy interface.

## 🚀 Live Demo
The application is deployed on Firebase Hosting: [https://rentaira-a07bf.web.app](https://rentaira-a07bf.web.app)

## ✨ Key Features

- **Smart Listings**: AI-enhanced property matching and detailed listings with high-quality media.
- **Human-Centered Dashboard**: Intuitive management of rentals, payments, and maintenance.
- **Smart Payments**: Integrated payment tracking and history.
- **Maintenance Requests**: Simple, real-time maintenance reporting and tracking.
- **AI-Powered Insights**: Smart recommendations for property search and management.
- **Multilingual Support**: Built-in support for multiple locales.

## 🛠 Tech Stack

- **Frontend**: React (with Vite for fast builds)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Backend/Auth**: Firebase (Authentication, Firestore, Analytics)
- **Design System**: Satoshi (primary brand font) and Inter

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RentAIra-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🚢 Deployment

The app is configured for deployment with Firebase Hosting.

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## 🎨 Branding & Identity

RentAIra follows a "Human-Centered" design language:
- **Font**: Satoshi (Professional & Approachable)
- **Primary Color**: Warm Coral (`#FF4D5A`)
- **Secondary Color**: Charcoal (`#1F2933`)

---
Built with ❤️ by the RentAIra Team.
