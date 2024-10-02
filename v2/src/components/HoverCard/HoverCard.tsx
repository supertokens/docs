import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import "./HoverCard.css";

type HoverCardContextType = {
  isOpen: boolean;
  show: () => void;
  hide: () => void;
};

const HoverCardContext = createContext({} as HoverCardContextType);

function HoverCardRoot({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const positionVariables = useMemo(() => {
    if (!ref.current)
      return {
        "--reference-height": "0px",
        "--reference-width": "0px",
        "--reference-top": "0px",
        "--reference-left": "0px",
      };
    const { top, height, width, left } = ref.current.getBoundingClientRect();
    return {
      "--reference-height": `${height}px`,
      "--reference-width": `${width}px`,
      "--reference-top": `${top}px`,
      "--reference-left": `${left}px`,
    };
  }, [isOpen]);

  return (
    <HoverCardContext.Provider
      value={{
        isOpen,
        show: () => setIsOpen(true),
        hide: () => setIsOpen(false),
      }}
    >
      <div
        className="hover-card"
        style={positionVariables}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        ref={ref}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

function HoverCardInfoIcon() {
  return (
    <img
      alt="Information"
      className="hover-card__info-icon"
      src="/img/form-question.png"
    />
  );
}

function HoverCardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, hide } = useContext(HoverCardContext);

  if (!isOpen) return null;
  return (
    <div className="hover-card__content" onMouseLeave={hide}>
      {children}
    </div>
  );
}

const HoverCard = Object.assign(HoverCardRoot, {
  Content: HoverCardContent,
  InfoIcon: HoverCardInfoIcon,
});

export default HoverCard;
