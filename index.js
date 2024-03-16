const fs = require('fs');
/**
 * A class for handling JSON file operations.
 */
class JSPEX {
    /**
     * Constructs a new JSPEX instance.
     * @param {string} filePath - The path to the JSON file.
     * @param {boolean} [useCache=true] - Whether to use caching.
     */
    constructor(filePath, useCache = true) {
        this.filePath = filePath;
        if (this.filePath) {
            try {
                fs.accessSync(this.filePath, fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK)
            } catch (err) {
                if (err.code === "ENOENT") {
                    fs.writeFileSync(this.filePath, "{}");
                } else {
                    throw new Error("File being used by another program.");
                }
            };
        } else {
            try {
                fs.accessSync("JSPEX.JSON", fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK)
            } catch (err) {
                if (err.code === "ENOENT") {
                    fs.writeFileSync("JSPEX.JSON", "{}");
                } else {
                    throw new Error("File being used by another program.");
                }
            };
        }
        this.file = fs.openSync(this.filePath ? this.filePath : "JSPEX.JSON");
        this.useCache = useCache;   // Prevents the need to read the file every time a method is called 
        this.cache = useCache ? this.#read() : {};
    }
    /**
     * Checks if a key exists in the file.
     * @param {string} key - The key to check.
     * @returns {boolean} - Whether the key exists.
     * @example
     * const db = new JSPEX();
     * console.log(db.keyExists("name")); // true
    */
    keyExists(key) {
        return (this.useCache ? this.cache : this.#read()).hasOwnProperty(key);
    }
    /**
    * Gets all the data from the file.
    * @returns {Object} - The data from the file.
    * @example
    * const db = new JSPEX();
    * console.log(db.getAll()); // {name: "John", age: 20}
    */
    getAll() {
        return this.useCache ? this.cache : this.#read();
    }
    /**
    * Gets the value of a key.
    * @param {string} key - The key to get the value of.
    * @returns {any} - The value of the key.
    * @example
    * const db = new JSPEX();
    * console.log(db.get("name")); // "John"
    * console.log(db.get("age")); // 20
    * console.log(db.get("location")); // null
    */
    get(key) {
        if (!this.keyExists(key)) return null;
        return (this.useCache ? this.cache : this.#read())[key];
    }
    /**
     * Erases all the data in the file.
     * @example
     * const db = new JSPEX();
     * db.erase();
     * console.log(db.getAll()); // {}
     * console.log(db.get("name")); // null
     */
    erase() {
        this.#write({});
    }
    /**
     * Deletes a key from the file.
     * @param {string} key - The key to delete.
     * @example
     * const db = new JSPEX();
     * db.set("name","John");
     * db.delete("name");
     * console.log(db.getAll()); // {age: 20}
     * console.log(db.get("name")); // null
     */
    delete(key) {
        if (!this.keyExists(key)) throw new Error("Key does not exist.");
        const data = this.useCache ? this.cache : this.#read();
        delete data[key];
        this.#write(data);
    }
    /**
     * Sets a key-value pair in the file.
     * @param {string} key - The key to set.
     * @param {any} value - The value to set.
     * @example
     * const db = new JSPEX();
     * db.set("name","John");
     * console.log(db.getAll()); // {name: "John"}
     * console.log(db.get("name")); // "John"
     */
    set(key, value) {
        const data = this.useCache ? this.cache : this.#read();
        data[key] = value;
        this.#write(data);
    }
    /**
     * Updates a key in the file.
     * @param {string} key - The key to update.
     * @param {function} callback - The callback to update the key.
     * @example
     * const db = new JSPEX();
     * db.set("age",20);
     * db.update("age", (age) => age + 1);
     * console.log(db.getAll()); // {age: 21}
     * console.log(db.get("age")); // 21
     */
    update(key, callback) {
        if (!this.keyExists(key)) throw new Error("Key does not exist.");
        const data = this.useCache ? this.cache : this.#read();
        data[key] = callback(data[key]);
        this.#write(data);
    }
    
    close() {
        fs.closeSync(this.file); //For Testing
    }
    /**
     * Writes data to the file.
     * @param {Object} data - The data to write.
     */
    #write(data) {
        try {
            const jsn = JSON.stringify(data); //
            fs.writeFileSync(this.filePath ? this.filePath : "JSPEX.JSON", jsn);
            if (this.useCache) this.cache = data;
        } catch (err) {
            throw err;
        }
    }
    /**
     * Reads the data from the file.
     * @returns {Object} - The data from the file.
     */
    #read() {
        try {
            return JSON.parse(fs.readFileSync(this.filePath ? this.filePath : "JSPEX.JSON", 'utf8'))
        } catch (err) {
            throw err;
        }
    }
}
module.exports = JSPEX;