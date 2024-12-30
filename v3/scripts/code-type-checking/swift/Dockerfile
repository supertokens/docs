FROM vinyldns/xcode:latest

# Set the working directory
WORKDIR /app

# Install additional dependencies
RUN brew update && brew install \
  swiftlint \
  swiftformat \
  mint \
  cocoapods

# Install additional build tools
RUN sudo gem install xcpretty

# Copy the entire project
COPY . .

# Install CocoaPods dependencies
RUN pod install || true

# Run SwiftLint for code style and quality checks
RUN swiftlint lint --strict

# Run SwiftFormat to check code formatting
RUN swiftformat --lint .

# Validate Swift package dependencies
RUN swift package resolve

# Attempt to build the project (without running)
RUN xcodebuild clean build \
  -workspace YourProject.xcworkspace \
  -scheme YourScheme \
  -configuration Debug \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  | xcpretty

# Optional: Run unit tests
RUN xcodebuild test \
  -workspace YourProject.xcworkspace \
  -scheme YourSchemeTests \
  -configuration Debug \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  | xcpretty

# Default command for validation
CMD ["swiftlint", "lint", "--strict"]
