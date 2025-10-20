# Changelog
All notable changes to this project will be documented in this file.

---

## [v0.1.27](https://github.com/crenata/bejibun-redis/compare/v0.1.26...v0.1.27) - 2025-10-18

### 🩹 Fixes

### 📖 Changes
Chore :
- Refactor some codes to bun native
- Adding log when throwing redis exception

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-redis/blob/master/CHANGELOG.md

---

## [v0.1.26](https://github.com/crenata/bejibun-redis/compare/v0.1.24...v0.1.26) - 2025-10-18

### 🩹 Fixes

### 📖 Changes
What's New :
- A minor adjustment on error logs

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-redis/blob/master/CHANGELOG.md

---

## [v0.1.24](https://github.com/crenata/bejibun-redis/compare/v0.1.23...v0.1.24) - 2025-10-16

### 🩹 Fixes

### 📖 Changes
What's New :
- Change logger style

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-redis/blob/master/CHANGELOG.md

---

## [v0.1.23](https://github.com/crenata/bejibun-redis/compare/v0.1.0...v0.1.23) - 2025-10-15

### 🩹 Fixes

### 📖 Changes
Update build indexing

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-redis/blob/master/CHANGELOG.md

---

## [v0.1.0](https://github.com/crenata/bejibun-redis/compare/v0.1.0...v0.1.0) - 2025-10-12

### 🩹 Fixes

### 📖 Changes
What's New :
- Redis

Available Redis :
- `.connection()` Multiple redis services
- `.get()` Get value stored on redis
- `.set()` Set value to redis
- `.del()` Delete value stored on redis
- `.subscribe()` Subscribe redis event
- `subcriber.unsubscribe()` Unsubscribe redis event
- `.publish()` Publish messages to subscriber
- `.pipeline()` Redis pipeline
- `.on()` Subscribe events for `connect` | `disconnect` | `error`
- `.off()` Unsubscribe events for `connect` | `disconnect` | `error`
- `.connect()` Manually connect to redis
- `.disconnect()` Manually disconnect from redis, will close all connections if not specify connection name

### ❤️Contributors
- Havea Crenata ([@crenata](https://github.com/crenata))
- Ghulje ([@ghulje](https://github.com/ghulje))

**Full Changelog**: https://github.com/crenata/bejibun-redis/blob/master/CHANGELOG.md