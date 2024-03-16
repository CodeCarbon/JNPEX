# JNPEX Documentation

JNPEX is straight forward libary to handle JSON file operations, providing functionalities to interact with JSON files such as reading, writing, updating, deleting, and checking the existence of keys.

## Installation

You can install JNPEX via npm:

```bash
npm install jspex
```

Then, require the module in your Node.js files:

```javascript
const JNPEX = require('jspex');
```

## Usage

### Constructor

The `JNPEX` class constructor creates a new instance for JSON file operations.

```javascript
const db = new JNPEX(filePath, useCache);
```

- `filePath` (string, optional): The path to the JSON file. If not provided, a default file named `JSPEX.JSON` will be created.
- `useCache` (boolean, optional, default: true): Specifies whether to use caching to improve performance by reducing the need to read the file every time.

### Methods

#### `keyExists(key)`

Checks if a key exists in the JSON file.

```javascript
db.keyExists("keyName");
```

- `key` (string): The key to check for existence.

#### `getAll()`

Retrieves all data from the JSON file.

```javascript
db.getAll();
```

#### `get(key)`

Retrieves the value associated with a key from the JSON file.

```javascript
db.get("keyName");
```

- `key` (string): The key to retrieve the value of.

#### `erase()`

Erases all data from the JSON file.

```javascript
db.erase();
```

#### `delete(key)`

Deletes a key and its associated value from the JSON file.

```javascript
db.delete("keyName");
```

- `key` (string): The key to delete.

#### `set(key, value)`

Sets a key-value pair in the JSON file.

```javascript
db.set("keyName", value);
```

- `key` (string): The key to set.
- `value` (any): The value to set.

#### `update(key, callback)`

Updates the value of a key using a callback function.

```javascript
db.update("keyName", (value) => value + 1);
```

- `key` (string): The key to update.
- `callback` (function): The callback function to update the key value.

## Example

```javascript
//Import the package
const JNPEX = require('jspex');

// Initialize a new JNPEX instance with a file named "contacts.json" with caching true
const addressBook = new JNPEX("contacts.json", true); // useCache is true by default.

// Add a new contact
addressBook.set("JohnDoe", {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St, City"
});

// Update John Doe's email address
addressBook.update("JohnDoe", (contact) => {
    contact.email = "john.doe@example.com";
    return contact;
});

// Retrieve John Doe's contact information
const johnDoeContact = addressBook.get("JohnDoe");
console.log("John Doe's Contact Information:", johnDoeContact);

// Check if a contact exists
const isContactExisting = addressBook.keyExists("JaneSmith");
console.log("Is Jane Smith's contact existing:", isContactExisting);

// Delete a contact
addressBook.delete("JohnDoe");

// Erase all contacts from the address book
addressBook.erase();

```

## Error Handling

- If the file being used by another program or inaccessible, an error will be thrown.
- If a key doesn't exist during delete or update operations, an error will be thrown.