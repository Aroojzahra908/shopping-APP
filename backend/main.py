from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (Allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
items: Dict[int, Dict] = {
    1: {"name": "Laptop", "price": 1000, "stock": 5},
    2: {"name": "Phone", "price": 500, "stock": 10},
}
orders: Dict[int, Dict] = {}
offers: Dict[int, int] = {1: 10}  # {item_id: discount}

# Models
class Item(BaseModel):
    name: str
    price: float
    stock: int
    offer: int = 0  # Default offer is 0 if not provided

class Order(BaseModel):
    item_id: int
    quantity: int

class Offer(BaseModel):
    item_id: int
    discount: int

# Endpoints

@app.get("/items")
def get_items():
    """Returns all available items with offers if available"""
    items_with_offers = []
    for item_id, item in items.items():
        offer = offers.get(item_id, 0)  # Get the discount offer, default to 0 if not available
        items_with_offers.append({**item, "id": item_id, "offer": offer})  
    return items_with_offers

@app.post("/orders")
def place_order(order: Order):
    """Places an order and applies discount if available"""
    if order.item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    if items[order.item_id]["stock"] < order.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    # Apply discount if available
    discount = offers.get(order.item_id, 0)
    total_price = items[order.item_id]["price"] * order.quantity * ((100 - discount) / 100)

    # Update stock
    items[order.item_id]["stock"] -= order.quantity

    # Generate order ID
    order_id = len(orders) + 1
    orders[order_id] = {"item_id": order.item_id, "quantity": order.quantity, "total_price": total_price}

    return {"message": "Order placed", "order_id": order_id, "total_price": total_price}

@app.get("/offers")
def get_offers():
    """Returns all available offers"""
    return offers

@app.post("/items-management")
def add_or_update_items(items_list: List[Item]):
    """Adds or Updates items in inventory"""
    new_item_ids = []

    for item in items_list:
        # Check if item already exists (by ID) or name
        existing_item = None
        for item_id, existing in items.items():
            if existing["name"].lower() == item.name.lower():
                existing_item = existing
                break

        if existing_item:
            # If item exists, update the item
            item_id = [item_id for item_id, existing in items.items() if existing["name"].lower() == item.name.lower()][0]
            items[item_id] = item.dict()
            # Update the offer (if any) for this item
            if item.offer > 0:
                offers[item_id] = item.offer
            new_item_ids.append(item_id)
        else:
            # Otherwise, add a new item
            new_id = max(items.keys(), default=0) + 1
            items[new_id] = item.dict()
            # Apply the offer (if any) for this item
            if item.offer > 0:
                offers[new_id] = item.offer
            new_item_ids.append(new_id)

    return {"message": "Items added/updated", "item_ids": new_item_ids}

@app.delete("/items-management/{item_id}")
def delete_item(item_id: int):
    """Deletes an item from inventory"""
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    # Remove associated offers
    offers.pop(item_id, None)

    del items[item_id]
    return {"message": "Item removed"}

@app.post("/offers-management")
def add_or_update_offer(offer: Offer):
    """Adds or Updates an offer for an item"""
    if offer.item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    # Update or add the offer
    offers[offer.item_id] = offer.discount
    return {"message": "Offer added/updated"}

@app.delete("/offers-management/{item_id}")
def delete_offer(item_id: int):
    """Deletes an offer"""
    if item_id not in offers:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    del offers[item_id]
    return {"message": "Offer removed"}


@app.put("/items-management/{item_id}")
def update_item(item_id: int, item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")

    # Update item
    items[item_id] = item.dict()
    return {"message": "Item updated", "item": items[item_id]}


# Run server with: `uvicorn main:app --reload`
