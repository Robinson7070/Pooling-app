# Testing the Items API

## GET /api/items

To test the GET endpoint, you can use a browser or a tool like curl or Postman:

```bash
# Using curl
curl http://localhost:3000/api/items

# Expected response:
# [{ "id": "1", "name": "Item 1", "description": "Description for Item 1" }, ...]
```

## POST /api/items

To test the POST endpoint, you need to send a JSON payload:

```bash
# Using curl
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item", "description": "Description for New Item"}'

# Expected response:
# { "id": "...", "name": "New Item", "description": "Description for New Item", "createdAt": "..." }
```

## Testing with JavaScript

```javascript
// GET request
async function getItems() {
  const response = await fetch('/api/items');
  const data = await response.json();
  console.log(data);
}

// POST request
async function addItem() {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'New Item',
      description: 'Description for New Item',
    }),
  });
  const data = await response.json();
  console.log(data);
}
```