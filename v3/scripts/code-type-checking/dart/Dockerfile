FROM dart:3.3.0

WORKDIR /app

RUN apt-get update && apt-get install -y \
  git \
  curl \
  unzip \
  wget \
  && rm -rf /var/lib/apt/lists/*


RUN git clone https://github.com/flutter/flutter.git /flutter
ENV PATH="/flutter/bin:$PATH"
RUN flutter doctor 

COPY pubspec.yaml pubspec.lock* ./
COPY .metadata .
COPY analysis_options.yaml .
COPY web ./web
COPY ios ./ios
COPY android ./android
COPY lib ./lib

RUN flutter pub get

COPY ./snippets ./lib/snippets

RUN flutter build web -t ./lib/main.dart
