import React from "react";
import Modal from "./modal/Modal";
import Card from "./card/Card";

export default function QuickstartGuideSelectionModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Modal>
      <Modal.OpenTrigger>{children}</Modal.OpenTrigger>
      <Modal.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ color: "black", marginTop: 0 }}>
            Select an Authentication Recipe
          </h3>
          <Card.List>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Email Password Login</Card.Title>
            </Card>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Passwordless</Card.Title>
            </Card>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Social/Enterprise Login</Card.Title>
            </Card>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Email Password + Social/Enterprise Login</Card.Title>
            </Card>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Passwordless + Social/Enterprise Login</Card.Title>
            </Card>
            <Card
              path="/docs/emailpassword/introduction"
              style={{ padding: "1rem" }}
            >
              <Card.Title>Phone Password Login</Card.Title>
            </Card>
          </Card.List>
        </div>
      </Modal.Content>
    </Modal>
  );
}
