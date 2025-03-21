
# FastAPI Ordering System

- Project Overview

This is a simple ordering system where:
- Users can browse items, place orders, and receive applicable offers.
- Staff can manage inventory and offers.
- Authentication and database persistence are not required (in-memory storage is used).

# Technology Stack
- Backend: FastAPI
- Storage: In-memory storage
- CORS Enabled: Yes (for frontend integration)

## Setup Instructions

###  Install Dependencies
```bash
pip install fastapi uvicorn pydantic
# Run the server: 
  uvicorn main:app --reload
  ```
# Features & API Endpoints

### Browse Items
-  GET /items → Fetch all available items along with stock levels and prices.

### Order Items

- POST /orders
   - Users can add items to a cart and confirm an order.
   - Discounts are automatically applied if available.

### Apply Offers
- GET /offers → View all available discounts.

### Manage Inventory (For Staff)
- POST /items-management → Add or update items.
- DELETE /items-management/{item_id} → Remove an item.
- PUT /items-management/{item_id} → Update item details.

### Manage Offers (For Staff)
- POST /offers-management → Add or update an offer.
- DELETE /offers-management/{item_id} → Remove an offer.

## Run the server: 

- uvicorn main:app --reload

### Test API in Browser or Postman

- Open http://127.0.0.1:8000/docs to see Swagger API documentation.
- Or use Postman to test endpoints manually.
- 
## View Offers
![View Offers](backend/images/view%20offers.png)


