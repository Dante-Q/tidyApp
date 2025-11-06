## 📁 Structure

```
controllers/
├── friends/
│   ├── send.js          # Send friend request
│   ├── accept.js        # Accept friend request
│   ├── reject.js        # Reject friend request
│   ├── remove.js        # Remove friend
│   ├── status.js        # Get friendship status
│   ├── list.js          # Get friends list
│   ├── requests.js      # Get pending requests
│   ├── cleanup.js       # Cleanup on user delete
│   └── index.js         # Central exports
└── utils/
    └── friendHelpers.js # Shared utilities
```

## 🔐 Shared Utilities

### `friendHelpers.js`

**`findFriendRequest(user, fromId)`**

- Finds a friend request by sender ID
- Used in: send, accept, reject, status

**`handleControllerError(res, message, error)`**

- Consistent error handling across all modules
- Logs error and returns standardized JSON response
- Can be exported to other controllers
