FROM python:3.8-slim

WORKDIR /app

# Install system dependencies for building and validation
RUN apt-get update && apt-get install -y \
  gcc \
  git \
  && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir pyright
RUN pip3 install --upgrade setuptools wheel 

COPY requirements.txt ./

RUN pip3 install -r requirements.txt 

COPY . .

CMD ["pyright", "./snippets"]
