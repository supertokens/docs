import React, { useState } from "react";
import "./Card.css";

function CardRoot({
  children,
  path,
  style = {},
}: {
  children: React.ReactNode;
  path: string;
  style?: React.CSSProperties;
}) {
  return (
    <a href={path} className="st-card" style={style}>
      {children}
    </a>
  );
}

function CardList({ children }: { children: React.ReactNode }) {
  return <ul className="st-card__list">{children}</ul>;
}

function CardIcon({ icon, alt }: { icon: string; alt: string }) {
  const iconPath = `/img/guides/${icon}.svg`;
  return (
    <div className="st-card__icon">
      <img src={iconPath} alt={alt} />
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className="st-card__title">{children}</div>;
}

const Card = Object.assign(CardRoot, {
  List: CardList,
  Icon: CardIcon,
  Title: CardTitle,
});

export default Card;
