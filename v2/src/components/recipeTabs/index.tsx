import * as React from "react";
declare global {
    interface Window {
        stAnalytics: any;
    }
}
let styles = require("./recipe-tabs.module.css").default;
import { sendButtonAnalytics } from "../utils";

type RecipeCardInfo = {
    imageSrc: string;
    linkTitle: string;
    url: string;
    cardBody: string;
    className: string;
    antcsInfo: {
        option_selected: string;
    };
};
const recipeTabsData: RecipeCardInfo[] = [
    {
        imageSrc: "/img/recipe-tabs/recipe-passwordless.png",
        url: "/docs/passwordless/introduction",
        linkTitle: "Passwordless",
        cardBody: "Add magic link or OTP based login with sessions to your app",
        className: "cardPasswordless",
        antcsInfo: {
            option_selected: "Passwordless"
        }
    },
    {
        imageSrc: "/img/recipe-tabs/recipe-email-social.png",
        url: "/docs/thirdpartyemailpassword/introduction",
        linkTitle: "Email password + Social Login",
        cardBody: "Add email password + social login with sessions to your app",
        className: "cardEmailPasswordSocial",
        antcsInfo: {
            option_selected: "Emailpassword+Sociallogin"
        }
    },
    {
        imageSrc: "/img/recipe-tabs/recipe-email.png",
        url: "/docs/emailpassword/introduction",
        linkTitle: "Only Email password login",
        cardBody: "Add email password functionality with sessions to your app",
        className: "cardEmailPassword",
        antcsInfo: {
            option_selected: "OnlyEmailPasswordLogin"
        }
    },
    {
        imageSrc: "/img/recipe-tabs/recipe-social.png",
        url: "/docs/thirdparty/introduction",
        linkTitle: "Only Social login",
        cardBody: "Add popular social providers or custom OAuth 2.0 providers with sessions to your app",
        className: "cardSocial",
        antcsInfo: {
            option_selected: "OnlySocialLogin"
        }
    },
    {
        imageSrc: "/img/recipe-tabs/recipe-session.png",
        url: "/docs/session/introduction",
        linkTitle: "Only Session Management",
        cardBody: "Auth method for adding only session management (no login) to your app",
        className: "cardSession",
        antcsInfo: {
            option_selected: "OnlySessionManagement"
        }
    },
];

function RecipeCard(recipeInfo: RecipeCardInfo) {
    const {
        imageSrc,
        url,
        linkTitle,
        cardBody,
        antcsInfo: { option_selected }
    } = recipeInfo;

    const handleCardClick = () => {
        sendButtonAnalytics("button_docs_gettingstarted_recipes", "v5", {
            option_clicked: option_selected
        });
    };

    return (
        <a href={url} onClick={handleCardClick} className={`${styles.stRecipeCardContainer} ${styles[recipeInfo.className]}`}>
            <img src={imageSrc} />
            <span style={{
                color: "#58a6ff"
            }}>{linkTitle}</span>
            <p style={{
                color: "#ffffff"
            }}>{cardBody}</p>
        </a>
    );
}

export default function RecipeTabs() {
    return (
        <div className={styles.stRecipeTabsContainer}>
            {recipeTabsData.map(cardInfo => {
                return <RecipeCard {...cardInfo} key={cardInfo.linkTitle} />;
            })}
        </div>
    );
}