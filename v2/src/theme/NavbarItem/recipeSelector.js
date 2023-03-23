import React, { useState, useEffect } from "react";
import clsx from "clsx";
import CloseIcon from "../../../static/img/recipe_selector_close.png";
import OpenIcon from "../../../static/img/recipe_selector_open.png";

import { useLocation } from '@docusaurus/router';

export default function RecipeSelector(props) {
  const { pathname } = useLocation()
  const currDocs = pathname.split("/")[2];
  const [open, setOpen] = useState(false);
  const activeSelector = (id) => {
    return id === currDocs;
  };
  const label = () => {
    switch (currDocs) {
      case "thirdpartyemailpassword":
        return "ThirdPartyEmailPassword Recipe";
      case "phonepassword":
        return "Phone Password Login";
      case "thirdpartypasswordless":
        return "ThirdPartyPasswordless Recipe";
      case "emailpassword":
        return "EmailPassword Recipe";
      case "thirdparty":
        return "ThirdParty Recipe";
      case "passwordless":
        return "Passwordless Recipe";
      case "session":
        return "Session Recipe";
      case "userroles":
        return "User Roles Recipe";
      case "mfa":
        return "Multi factor auth";
      case "microservice_auth":
        return "Microservice Auth";
      case "userdashboard":
        return "User Management Dashboard";
      default:
        return "Select Recipe";
    }
  };
  useEffect(() => {
    const closeDropDown = (e) => {
      if (e.target.classList[0].startsWith("recipe_selector")) {
        // no-op
      } else {
        setOpen(false);
      }
    };
    window.addEventListener("click", closeDropDown);
  }, []);
  return (
    <div className="recipe_selector">
      <div
        onClick={() => setOpen(!open)}
        className={clsx("recipe_selector__dropdown", { open: open })}
      >
        <span>{label()}</span>
        <div>
          <img src={CloseIcon} style={{ transform: open ? "rotate(180deg)" : "", transition: "all 250ms linear" }} />
        </div>
      </div>
      <div
        className="recipe_selector__menu"
        style={{ display: open ? "grid" : "none" }}
      >
        <div className="recipe_selector__menu__auth_methods">
          <h6 className="recipe_selector__menu__auth_methods_heading">
            Auth Methods
          </h6>
          <ul>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("thirdpartyemailpassword"),
              })}
            >
              <a href="/docs/thirdpartyemailpassword/introduction">Email password + Social Login</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("passwordless"),
              })}
            >
              <a href="/docs/passwordless/introduction">Passwordless</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("emailpassword"),
              })}
            >
              <a href="/docs/emailpassword/introduction">Email password Login</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("thirdpartypasswordless"),
              })}
            >
              <a href="/docs/thirdpartypasswordless/introduction">Social Login + Passwordless</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("thirdparty"),
              })}
            >
              <a href="/docs/thirdparty/introduction">Social Login</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("phonepassword"),
              })}
            >
              <a href="/docs/phonepassword/introduction">Phone Password Login</a>
            </li>
          </ul>
        </div>
        <div className="recipe_selector__menu__add_ons">
          <h6 className="recipe_selector__menu__add_ons_heading">Add ons</h6>
          <ul>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("session"),
              })}
            >
              <a href="/docs/session/introduction">Session Management</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("userdashboard"),
              })}
            >
              <a href="/docs/userdashboard/about">User Management Dashboard</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("userroles"),
              })}
            >
              <a href="/docs/userroles/introduction">User Roles (RBAC)</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("mfa"),
              })}
            >
              <a href="/docs/mfa/introduction">Multi factor Authentication</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("microservice_auth"),
              })}
            >
              <a href="/docs/microservice_auth/introduction">Microservice Authentication</a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("microservice_auth"),
              })}
            >
              <a href="/docs/multitenancy/introduction">Multitenancy</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
