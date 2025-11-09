import React from "react";
import { Container } from "react-bootstrap";

export default function FooterComponent() {
  return (
    <footer className="bg-dark text-white py-5">
      <Container className="text-center">
        <h3 className="text-primary">MovieVerse</h3>
        <p>© 2024 MovieVerse. All rights reserved.</p>
      </Container>
    </footer>
  );
}
