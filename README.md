# web-art-gallery

Contributors:
- [Issaris Nikolaos 1066471 (nickaris1)](https://github.com/nickaris1 "Issaris Nikolaos")
- [Liapakis Georgios 1066523 (g3ol)](https://github.com/G3OL "Liapakis Georgios")

---
### Prerequisites

This software requires nodejs built with version 16.15.0 (https://nodejs.org/en/download/)


### Installation
1. Clone the repository 
   ```sh
   git clone https://github.com/nickaris1/web-art-gallery
   ```
2. Install npm packages
   ```sh
   npm install
   ```
### Start the application
```sh
    npm run start
```


## Build with Docker
```sh
    docker build -t web_art_gallery .
```

```sh
    docker run -p 8080:5500 web_art_gallery
```