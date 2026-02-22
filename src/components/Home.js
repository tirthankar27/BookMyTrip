import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { 
  FaMapMarkedAlt, 
  FaMoneyBillWave, 
  FaMobileAlt, 
  FaClock, 
  FaUserFriends, 
  FaBus 
} from "react-icons/fa";

// Blue gradient remains unchanged
const blueGradient = css`
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

// All components now use theme via props.theme.darkMode
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
  background: transparent;
`;

const HeroSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  ${blueGradient}
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.darkMode ? "rgba(255,255,255,0.9)" : "#2d3748"};
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.darkMode ? "#3b82f6" : "#1d4ed8"};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: ${({ theme }) => theme.darkMode ? "#2563eb" : "#1e40af"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  ${blueGradient}
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  ${blueGradient}
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.darkMode ? "rgba(255,255,255,0.9)" : "#4a5568"};
`;

export default function Home({ darkMode, loadingRef }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingRef?.current) {
      loadingRef.current.continuousStart();
      setTimeout(() => {
        if (loadingRef?.current) {
          loadingRef.current.complete();
        }
      }, 100);
    }
  }, [loadingRef]);

  const theme = { darkMode };

  return (
    <Container theme={theme}>
      <HeroSection>
        <Title>BookMyTrip</Title>
        <Subtitle theme={theme}>
          Your journey begins here - Book bus tickets across India with ease
        </Subtitle>
        <CTAButton theme={theme} onClick={() => navigate("/searchBus")}>
          Find Buses Now
        </CTAButton>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard theme={theme}>
          <FeatureIcon>
            <FaMapMarkedAlt size={40} />
          </FeatureIcon>
          <FeatureTitle>Multiple Routes</FeatureTitle>
          <FeatureDescription theme={theme}>
            Choose from various routes with different boarding points.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureIcon>
            <FaMoneyBillWave size={40} />
          </FeatureIcon>
          <FeatureTitle>Best Prices</FeatureTitle>
          <FeatureDescription theme={theme}>
            Get the lowest fares with exclusive discounts.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureIcon>
            <FaMoneyBillWave size={40} />
          </FeatureIcon>
          <FeatureTitle>Easy Booking</FeatureTitle>
          <FeatureDescription theme={theme}>
            Book tickets in just a few taps with our platform.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard theme={theme}>
          <FeatureIcon>
            <FaMoneyBillWave size={40} />
          </FeatureIcon>
          <FeatureTitle>Group Discounts</FeatureTitle>
          <FeatureDescription theme={theme}>
            Special rates for group bookings and frequent travelers.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
}