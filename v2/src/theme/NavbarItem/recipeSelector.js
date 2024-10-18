import React, { useCallback, useState, useEffect, useRef } from "react";
import clsx from "clsx";
import CloseIcon from "../../../static/img/recipe_selector_close.png";

import { useLocation } from "@docusaurus/router";

export default function RecipeSelector(props) {
  const { pathname } = useLocation();
  const currDocs = pathname.split("/")[2];
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const activeSelector = (id) => {
    return id === currDocs;
  };
  const label = () => {
    switch (currDocs) {
      case "thirdpartyemailpassword":
        return "ThirdParty + EmailPassword Recipe";
      case "phonepassword":
        return "Phone Password Login";
      case "thirdpartypasswordless":
        return "ThirdParty + Passwordless Recipe";
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
      case "private-access-token-authentication":
        return "Private Access Token Authentication";
      case "userdashboard":
        return "User Management Dashboard";
      case "multitenancy":
        return "Multi Tenancy";
      case "anomaly_detection":
        return "Attack Protection Suite";
      case "attackprotectionsuite":
        return "Attack Protection Suite";
      case "unified-login":
        return "Unified Login";
      default:
        return "Select Recipe";
    }
  };
  const closeDropdownMenuOnOusideClick = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeDropdownMenuOnOusideClick);
    return () =>
      window.removeEventListener("click", closeDropdownMenuOnOusideClick);
  }, []);

  return (
    <div className="recipe_selector" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className={clsx("recipe_selector__dropdown", { open: open })}
      >
        <span>{label()}</span>
        <div>
          <img
            src={CloseIcon}
            style={{
              transform: open ? "rotate(180deg)" : "",
              transition: "all 250ms linear",
            }}
          />
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
              <a href="/docs/thirdpartyemailpassword/introduction">
                Email password + Social / Enterprise Login
              </a>
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
              <a href="/docs/emailpassword/introduction">
                Email password Login
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("thirdpartypasswordless"),
              })}
            >
              <a href="/docs/thirdpartypasswordless/introduction">
                Social / Enterprise Login + Passwordless
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("thirdparty"),
              })}
            >
              <a href="/docs/thirdparty/introduction">
                Social / Enterprise Login
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__auth_methods_items", {
                active: activeSelector("phonepassword"),
              })}
            >
              <a href="/docs/phonepassword/introduction">
                Phone Password Login
              </a>
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
                active: activeSelector("private-access-token-authentication"),
              })}
            >
              <a href="/docs/private-access-token-authentication/introduction">
                Private Access Token Authentication
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("multitenancy"),
              })}
            >
              <a href="/docs/multitenancy/introduction">
                Multi tenancy / organizations
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("anomaly_detection"),
              })}
            >
              <a href="/docs/attackprotectionsuite/introduction">
                Attack Protection Suite
              </a>
            </li>
            <li
              className={clsx("recipe_selector__menu__add_ons_items", {
                active: activeSelector("unified-login"),
              })}
            >
              <a href="/docs/unified-login/introduction">Unified Login</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
