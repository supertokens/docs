import React from "react";
import Modal from "./modal/Modal";
import Button from "./button/Button";

export default function ExampleAppSelectionModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Modal>
      <Modal.OpenTrigger>{children}</Modal.OpenTrigger>
      <Modal.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ color: "black", marginTop: 0, marginBottom: "0.1rem" }}>
            Select an Example App
          </h3>
          <p style={{ color: "grey", marginBottom: "0" }}>
            Specify your tech stack and the authentication method that you want
            to use.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label htmlFor="tech-stack">Frontend</label>
              <select>
                <option>React</option>
                <option>NextJS</option>
                <option>Angular</option>
                <option>Vuejs</option>
              </select>
            </div>
            <div>
              <label htmlFor="tech-stack">Backend</label>
              <select>
                <option>NodeJS/Express</option>
                <option>NodeJS/NestJS</option>
                <option>NextJS</option>
                <option>Python/Flask</option>
                <option>Python/Django</option>
                <option>Python/FastAPI</option>
                <option>GoLang</option>
              </select>
            </div>
            <div>
              <label htmlFor="tech-stack">Authentication Method</label>
              <select>
                <option>Email Password Login</option>
                <option>Passwordless</option>
                <option>Social/Enterprise Login</option>
                <option>Email Password + Social/Enterprise Login</option>
                <option>Passwordless + Social/Enterprise Login</option>
                <option>Phone Password Login</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button as="a" href="/docs/emailpassword/example-app">
              Submit
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}
