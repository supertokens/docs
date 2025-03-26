// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "SnippetValidator",
    platforms: [
        .macOS(.v10_15)
    ],
    dependencies: [
        .package(url: "https://github.com/supertokens/supertokens-ios.git", from: "0.3.2"),
        .package(url: "https://github.com/alamofire/alamofire.git", from: "5.4.0"),
        .package(url: "https://github.com/google/GoogleSignIn-iOS.git", from: "6.0.0"),
    ],
    targets: [
        .executableTarget(
            name: "SnippetValidator",
            dependencies: [
                "SuperTokens",
                "Alamofire",
                .product(name: "GoogleSignIn", package: "GoogleSignIn-iOS")
            ]
        ),
    ]
)
