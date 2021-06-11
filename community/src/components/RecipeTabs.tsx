import * as React from "react";
declare global {
    interface Window {
        stAnalytics: any;
    }
}
import "./recipe-tabs.module.css";

function getAnalytics() {
    return new Promise((res, rej) => {
        let numberOfRetries = 20;
        const analytics = window.stAnalytics;
        if (analytics) {
            res(analytics.getInstance());
            return;
        }

        let interval = setInterval(() => {
            const stAnalytics = window.stAnalytics;
            numberOfRetries--;
            if (stAnalytics) {
                clearInterval(interval);
                res(stAnalytics.getInstance());
                return;
            }
            if (numberOfRetries < 0) {
                clearInterval(interval);
                rej("Already waited for 2 seconds");
            }
        }, 100);
    });
}

const sendButtonAnalytics = (eventName: string, version = "v5", options?: Object) => {
    getAnalytics().then((stAnalytics: any) =>
        stAnalytics.sendEvent(
            eventName,
            {
                type: "button_click",
                ...options
            },
            version
        )
    );
}

type RecipeCardInfo = {
    imageSrc: string;
    linkTitle: string;
    url: string;
    cardBody: string;
    antcsInfo: {
        option_selected: string;
    };
};
const recipeTabsData: RecipeCardInfo[] = [
    {
        imageSrc: "/static/assets/recipe-tabs/recipe-email-social.png",
        url: "/docs/thirdpartyemailpassword/introduction",
        linkTitle: "Email password + Social Login",
        cardBody: "Add email password + social login with sessions to your app",
        antcsInfo: {
            option_selected: "Emailpassword+Sociallogin"
        }
    },
    {
        imageSrc: "/static/assets/recipe-tabs/recipe-email.png",
        url: "/docs/emailpassword/introduction",
        linkTitle: "Only Email password login",
        cardBody: "Add email password functionality with sessions to your app",
        antcsInfo: {
            option_selected: "OnlyEmailPasswordLogin"
        }
    },
    {
        imageSrc: "/static/assets/recipe-tabs/recipe-session.png",
        url: "/docs/session/introduction",
        linkTitle: "Only Session Management",
        cardBody: "Auth method for adding only session management (no login) to your app",
        antcsInfo: {
            option_selected: "OnlySessionManagement"
        }
    },
    {
        imageSrc: "/static/assets/recipe-tabs/recipe-social.png",
        url: "/docs/thirdparty/introduction",
        linkTitle: "Only Social login",
        cardBody: "Add popular social providers or custom OAuth 2.0 providers with sessions to your app",
        antcsInfo: {
            option_selected: "OnlySocialLogin"
        }
    }
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
        <a href={url} onClick={handleCardClick} className="st-recipe-card-container">
            <img src={imageSrc} />
            <span>{linkTitle}</span>
            <p>{cardBody}</p>
        </a>
    );
}

export default function RecipeTabs() {
    React.useEffect(() => {
        
        const elementsToHide = document.querySelector("#supertokens-recipe-tabs + ul");
        if (elementsToHide !== null) {
            elementsToHide.remove();
        }
    });
    return (
        <div className="st-recipe-tabs-container">
            {recipeTabsData.map(cardInfo => {
                return <RecipeCard {...cardInfo} key={cardInfo.linkTitle} />;
            })}
        </div>
    );
}