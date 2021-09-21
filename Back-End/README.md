# MismatchResolver
## Install using Docker
```
 git clone https://github.com/Polletz/MismatchResolver.git
 cd MismatchResolver
 docker build -t mismatchresolver-backend .
 docker run -p 8080:8080 --rm -it mismatchresolver-backend
```

To run in background:
```
 docker run -dp 8080:8080 --rm -it mismatchresolver-backend
```
