## Create React Project

- npx create-vite frontend --template react
- cd frontend
- npm install

## Install Dependencies

- npm install axios tailwindcss react-router-dom
- npx tailwindcss init -p

# Shopping App 🛒

A simple shopping app built with React and a FastAPI backend.

## Features
- View available items with price, stock, and discounts.
- Place an order by selecting an item and quantity.
- Discount applied automatically if available.

## Installation

### Frontend Setup (React)
1. Clone the repository:
   ```sh
   git clone https://github.com/Aroojzahra908/shopping-APP
   cd shopping-APP

## Install dependencies:

npm install

## Start the app:
npm run dev


# Backend Setup (FastAPI)
Install dependencies:

pip install fastapi uvicorn
## Start the server:

uvicorn main:app --reload

# API Endpoints
1. GET /items - Fetch all items.
2. GET /offers - Fetch discount offers.
3. POST /orders - Place an order.

# Usage
1. Start the backend server.
2. Run the React frontend.
3. Select an item, enter quantity, and place an order.

# Future Improvements
1. Add user authentication.
2. Improve UI design.
3. Implement order history.



## Admin Page
![Admin Page](src/assets/Admin%20page.png)

## User Page
![User Page](src/assets/user%20page.png)
