import React, { createContext, useContext, useEffect, useState } from "react";
import "./Modal.css";

type ModalContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

function ModalRoot({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function ModalOpenTrigger({ children }: { children: React.ReactNode }) {
  const { open } = useContext(ModalContext);
  // @ts-expect-error
  return React.cloneElement(children, { onClick: open });
}

function ModalContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useContext(ModalContext);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          close();
        }
      });
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="st-modal__overlay" onClick={close}>
      <div className="st-modal__content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalCloseTrigger({ children }: { children: React.ReactNode }) {
  const { close } = useContext(ModalContext);
  // @ts-expect-error
  return React.cloneElement(children, { onClick: close });
}

const Modal = Object.assign(ModalRoot, {
  OpenTrigger: ModalOpenTrigger,
  Content: ModalContent,
  CloseTrigger: ModalCloseTrigger,
});

export default Modal;
