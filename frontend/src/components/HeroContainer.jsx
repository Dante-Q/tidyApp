// src/components/HeroContainer.jsx
import { Container } from "@mantine/core";

export default function HeroContainer({ children }) {
  return (
    <div className="hero-container">
      <Container size={1200} style={{ position: "relative", zIndex: 1 }}>
        {children}
      </Container>
    </div>
  );
}
