# wrapped-bcrypt

## Install

```bash
npm install @sqrtthree/wrapped-bcrypt
```

## API

### `hash(clearText: string, salt?: number | string): Promise<string>`

Asynchronously generates a hash for the given string.

#### clearText

String to hash.

#### salt

Salt length to generate or salt to use.

### `compare(clearText: string, hashString: string): Promise<boolean>`

Asynchronously compares the given data against the given hash.

#### clearText

String to compare.

#### hashString

String to be compared to.
