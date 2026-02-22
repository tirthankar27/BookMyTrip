import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import image4 from "../assets/images4.png";
import ceoimg from "../assets/ceo.png";
import ctoimg from "../assets/cto.png";
import cooimg from "../assets/coo.png";
import cfoimg from "../assets/cfo.png";
import { useNavigate } from "react-router-dom";
import { FaRoute, FaUsers, FaCity, FaBus } from "react-icons/fa";

// Blue gradient (same as Home page)
const blueGradient = css`
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

// Container with transparent background
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
`;

// Animated background elements
const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    filter: blur(80px);
    opacity: ${({ theme }) => theme.darkMode ? 0.2 : 0.1};
    top: -100px;
    right: -50px;
    animation: float 20s infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
    filter: blur(100px);
    opacity: ${({ theme }) => theme.darkMode ? 0.15 : 0.1};
    bottom: -150px;
    left: -100px;
    animation: floatReverse 25s infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, 30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }
  
  @keyframes floatReverse {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-30px, -30px) rotate(-120deg); }
    66% { transform: translate(20px, -20px) rotate(-240deg); }
  }
`;

// Content wrapper
const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem 0;
`;

// Enhanced Glass card component with better frosted effect
const GlassCard = styled.div`
  background: ${({ theme }) => theme.darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  border-radius: 12px;
  padding: ${({ padding }) => padding || "2.5rem"};
  transition: all 0.4s ease;
  border: ${({ theme }) =>
    theme.darkMode
      ? "1px solid rgba(255, 255, 255, 0.125)"
      : "1px solid rgba(255, 255, 255, 0.3)"};
  box-shadow: ${({ theme }) =>
    theme.darkMode
      ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      : "0 8px 32px 0 rgba(31, 38, 135, 0.1)"};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) =>
      theme.darkMode
        ? "0 15px 40px 0 rgba(59, 130, 246, 0.3)"
        : "0 15px 40px 0 rgba(59, 130, 246, 0.2)"};
    border: ${({ theme }) =>
      theme.darkMode
        ? "1px solid rgba(59, 130, 246, 0.3)"
        : "1px solid rgba(59, 130, 246, 0.3)"};
  }
`;

// Enhanced Stat card
const StatCard = styled.div`
  background: ${({ theme }) => theme.darkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ color }) => color};
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
`;

const StatNumber = styled.h3`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  text-shadow: ${({ theme }) =>
    theme.darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "none"};
  background: ${({ theme }) =>
    theme.darkMode
      ? "linear-gradient(135deg, #fff 0%, #e0e0e0 100%)"
      : "none"};
  -webkit-background-clip: ${({ theme }) => theme.darkMode ? "text" : "none"};
  background-clip: ${({ theme }) => theme.darkMode ? "text" : "none"};
  color: ${({ theme }) => theme.darkMode ? "transparent" : "inherit"};
`;

const StatLabel = styled.p`
  color: ${({ theme }) => theme.darkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"};
  margin-bottom: 0;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

// Title with gradient
const GradientTitle = styled.h1`
  font-size: ${({ size }) => size || "4rem"};
  font-weight: 800;
  margin-bottom: 1.5rem;
  ${blueGradient}
  text-shadow: ${({ theme }) =>
    theme.darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.1)"};
  animation: titleGlow 3s ease-in-out infinite;
  
  @keyframes titleGlow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.3)); }
    50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)); }
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  ${blueGradient}
  text-shadow: ${({ theme }) =>
    theme.darkMode ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)"};
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100px;
  }
`;

// Enhanced Feature item
const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  padding: 1.2rem;
  border-radius: 20px;
  background: ${({ theme }) =>
    theme.darkMode
      ? "rgba(255, 255, 255, 0.02)"
      : "rgba(59, 130, 246, 0.02)"};
  
  &:hover {
    transform: translateX(15px);
    background: ${({ theme }) =>
      theme.darkMode
        ? "rgba(59, 130, 246, 0.15)"
        : "rgba(59, 130, 246, 0.08)"};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`;

const FeatureIcon = styled.div`
  margin-right: 1.5rem;
  font-size: 2.2rem;
  color: ${({ color }) => color};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: all 0.3s ease;
  
  ${FeatureItem}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"};
  margin-bottom: 0;
  line-height: 1.7;
  font-size: 1.1rem;
`;

// Enhanced Team card
const TeamCard = styled.div`
  text-align: center;
  transition: all 0.4s ease;
  padding: 2.5rem 1.5rem;
  border-radius: 28px;
  background: ${({ theme }) =>
    theme.darkMode
      ? "rgba(17, 25, 40, 0.4)"
      : "rgba(255, 255, 255, 0.5)"};
  backdrop-filter: blur(10px);
  border: ${({ theme }) =>
    theme.darkMode
      ? "1px solid rgba(255, 255, 255, 0.05)"
      : "1px solid rgba(255, 255, 255, 0.3)"};
  
  &:hover {
    transform: translateY(-12px);
    background: ${({ theme }) =>
      theme.darkMode
        ? "rgba(17, 25, 40, 0.8)"
        : "rgba(255, 255, 255, 0.9)"};
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(59, 130, 246, 0.3);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
  }
`;

const TeamImage = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    opacity: 0.3;
    filter: blur(15px);
    z-index: -1;
  }
  
  img {
    width: 170px;
    height: 170px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid transparent;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    padding: 4px;
    transition: all 0.4s ease;
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
    
    ${TeamCard}:hover & {
      transform: scale(1.05);
      box-shadow: 0 25px 50px rgba(59, 130, 246, 0.5);
    }
  }
`;

const TeamName = styled.h4`
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const TeamRole = styled.p`
  color: #3b82f6;
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const SocialLinks = styled.div`
  a {
    color: #3b82f6;
    margin: 0 0.75rem;
    opacity: 0.8;
    transition: all 0.3s ease;
    font-size: 1.5rem;
    display: inline-block;
    
    &:hover {
      opacity: 1;
      transform: translateY(-5px) scale(1.2);
      color: #1d4ed8;
      filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4));
    }
  }
`;

// Enhanced Testimonial card
const TestimonialCard = styled.div`
  background: ${({ theme }) =>
    theme.darkMode
      ? "rgba(17, 25, 40, 0.6)"
      : "rgba(255, 255, 255, 0.85)"};
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 32px;
  padding: 2.5rem;
  transition: all 0.4s ease;
  border: ${({ theme }) =>
    theme.darkMode
      ? "1px solid rgba(255, 255, 255, 0.125)"
      : "1px solid rgba(255, 255, 255, 0.3)"};
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    right: 20px;
    font-size: 150px;
    font-family: serif;
    color: ${({ theme }) => theme.darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"};
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: ${({ theme }) =>
      theme.darkMode
        ? "0 30px 50px rgba(59, 130, 246, 0.3)"
        : "0 30px 50px rgba(59, 130, 246, 0.2)"};
    border: 1px solid rgba(59, 130, 246, 0.3);
    background: ${({ theme }) =>
      theme.darkMode
        ? "rgba(17, 25, 40, 0.8)"
        : "rgba(255, 255, 255, 0.95)"};
  }
`;

const Stars = styled.div`
  margin-bottom: 1.5rem;
  color: #ffc107;
  font-size: 1.3rem;
  letter-spacing: 3px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const TestimonialText = styled.p`
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  margin-bottom: 1.5rem;
  font-size: 1.15rem;
  line-height: 1.7;
  font-style: italic;
  position: relative;
  z-index: 1;
`;

const TestimonialAuthor = styled.h6`
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
  font-weight: 700;
`;

const TestimonialLocation = styled.small`
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

// Enhanced Progress bar
const ProgressBar = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
  border-radius: 20px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(4px);
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ width }) => width};
  background: ${({ color }) => color || "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"};
  border-radius: 20px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Enhanced Timeline item
const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.8rem 1rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) =>
      theme.darkMode
        ? "rgba(59, 130, 246, 0.15)"
        : "rgba(59, 130, 246, 0.08)"};
    transform: translateX(15px);
  }
`;

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  position: relative;
  margin-right: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: inherit;
    opacity: 0.3;
    top: -6px;
    left: -6px;
    animation: ripple 2s infinite;
  }
  
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.3; }
    100% { transform: scale(2); opacity: 0; }
  }
`;

const TimelineText = styled.span`
  color: ${({ theme }) => theme.darkMode ? "#ffffff" : "#000000"};
  font-size: 1.2rem;
  font-weight: 500;
`;

// Enhanced Banner
const Banner = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 48px;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: 0 30px 60px rgba(59, 130, 246, 0.4);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%);
    animation: rotate 20s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(50px);
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const BannerTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  letter-spacing: -1px;
`;

const BookButton = styled.button`
  background: white;
  color: #1d4ed8;
  border: none;
  padding: 1.2rem 3.5rem;
  font-size: 1.4rem;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.4s ease;
  font-weight: 700;
  position: relative;
  z-index: 1;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 25px 40px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  i {
    margin-right: 10px;
    font-size: 1.4rem;
  }
`;

// Mission/Vision icon container
const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
  margin-right: 1.5rem;
  transition: all 0.3s ease;
  
  ${GlassCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

export default function About({ darkMode, loadingRef }) {
  const navigate = useNavigate();
  const theme = { darkMode };
  
  const [animatedStats, setAnimatedStats] = useState({
    routes: 0,
    customers: 0,
    cities: 0,
    operators: 0
  });

  useEffect(() => {
    if (loadingRef?.current) {
      loadingRef.current.continuousStart();
      setTimeout(() => {
        loadingRef.current.complete();
      }, 10);
    }
    
    const targets = {
      routes: 5000,
      customers: 2.5,
      cities: 500,
      operators: 250
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        routes: Math.floor(progress * targets.routes),
        customers: (progress * targets.customers).toFixed(1),
        cities: Math.floor(progress * targets.cities),
        operators: Math.floor(progress * targets.operators)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [loadingRef]);

  return (
    <Container>
      <AnimatedBackground theme={theme} />
      
      <ContentWrapper className="container">
        {/* Hero Section */}
        <div className="text-center mb-5 animate__animated animate__fadeInDown">
          <GradientTitle size="4rem">About BookMyTrip</GradientTitle>
          <GlassCard theme={theme} className="d-inline-block mx-auto" style={{ maxWidth: "900px" }}>
            <p className={`fs-4 mb-0`} style={{ 
              color: darkMode ? "#fff" : "#000",
              lineHeight: "1.7",
              fontSize: "1.3rem"
            }}>
              Your journey, our passion. We're here to make every trip memorable, 
              comfortable, and hassle-free.
            </p>
          </GlassCard>
        </div>

        {/* Stats Section */}
        <div className="row g-4 mb-5">
          <div className="col-md-3 col-6">
            <StatCard theme={theme}>
              <StatIcon color="#3b82f6">
                <FaRoute size={50} />
              </StatIcon>
              <StatNumber theme={theme}>{animatedStats.routes}+</StatNumber>
              <StatLabel theme={theme}>Routes</StatLabel>
            </StatCard>
          </div>
          <div className="col-md-3 col-6">
            <StatCard theme={theme}>
              <StatIcon color="#28a745">
                <FaUsers size={50} />
              </StatIcon>
              <StatNumber theme={theme}>{animatedStats.customers}M+</StatNumber>
              <StatLabel theme={theme}>Happy Customers</StatLabel>
            </StatCard>
          </div>
          <div className="col-md-3 col-6">
            <StatCard theme={theme}>
              <StatIcon color="#ffc107">
                <FaCity size={50} />
              </StatIcon>
              <StatNumber theme={theme}>{animatedStats.cities}+</StatNumber>
              <StatLabel theme={theme}>Cities</StatLabel>
            </StatCard>
          </div>
          <div className="col-md-3 col-6">
            <StatCard theme={theme}>
              <StatIcon color="#17a2b8">
                <FaBus size={50} />
              </StatIcon>
              <StatNumber theme={theme}>{animatedStats.operators}+</StatNumber>
              <StatLabel theme={theme}>Operators</StatLabel>
            </StatCard>
          </div>
        </div>

        {/* Book a Bus Banner */}
        <div className="row mb-5">
          <div className="col-12">
            <Banner>
              <BannerTitle>BOOK A BUS FOR FAMILY TRIP</BannerTitle>
              <BookButton onClick={() => navigate("/searchBus")}>
                <i className="bi bi-bus-front"></i>
                Book Now
              </BookButton>
            </Banner>
          </div>
        </div>

        {/* Feature Section */}
        <GlassCard theme={theme} className="mb-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <SectionTitle theme={theme}>Why Choose Us?</SectionTitle>
              <div>
                <FeatureItem theme={theme}>
                  <FeatureIcon color="#3b82f6">
                    <i className="bi bi-diagram-3"></i>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle theme={theme}>Wide Network</FeatureTitle>
                    <FeatureDescription theme={theme}>
                      Book buses from trusted operators across India with our extensive network of 250+ partners, covering every major route.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
                
                <FeatureItem theme={theme}>
                  <FeatureIcon color="#28a745">
                    <i className="bi bi-clock-history"></i>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle theme={theme}>Real-Time Availability</FeatureTitle>
                    <FeatureDescription theme={theme}>
                      Know exactly which seats are free with live updates from operators — no surprises, instant confirmation guaranteed.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
                
                <FeatureItem theme={theme}>
                  <FeatureIcon color="#ffc107">
                    <i className="bi bi-shield-lock"></i>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle theme={theme}>Secure Payments</FeatureTitle>
                    <FeatureDescription theme={theme}>
                      Pay with confidence using our encrypted payment gateway with multiple options including UPI, cards, and wallets.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
                
                <FeatureItem theme={theme}>
                  <FeatureIcon color="#17a2b8">
                    <i className="bi bi-phone"></i>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle theme={theme}>User-Friendly Interface</FeatureTitle>
                    <FeatureDescription theme={theme}>
                      Designed for comfort and ease of use on both desktop and mobile devices with intuitive navigation.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
                
                <FeatureItem theme={theme}>
                  <FeatureIcon color="#dc3545">
                    <i className="bi bi-headset"></i>
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle theme={theme}>24/7 Customer Support</FeatureTitle>
                    <FeatureDescription theme={theme}>
                      We're here to help, anytime you need us with our dedicated support team available via phone, chat, and email.
                    </FeatureDescription>
                  </FeatureContent>
                </FeatureItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="rounded-4 overflow-hidden" style={{
                  background: darkMode ? "rgba(17, 25, 40, 0.4)" : "transparent",
                  border: darkMode ? "1px solid rgba(255,255,255,0.125)" : "none",
                  padding: "1rem",
                  borderRadius: "32px"
                }}>
                  <img 
                    src={image4} 
                    alt="BookMyTrip App Preview"
                    className="img-fluid rounded-4"
                    style={{ 
                      maxHeight: "500px", 
                      width: "100%", 
                      objectFit: "cover",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                      transition: "all 0.4s ease"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Mission & Vision Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <GlassCard theme={theme} className="h-100">
              <div className="d-flex align-items-center mb-4">
                <IconContainer>
                  <i className="bi bi-rocket fs-1"></i>
                </IconContainer>
                <SectionTitle theme={theme} className="mb-0">Our Mission</SectionTitle>
              </div>
              <p className="fs-5 mb-4" style={{ 
                color: darkMode ? "#fff" : "#000",
                lineHeight: "1.8",
                fontSize: "1.2rem"
              }}>
                To make intercity bus travel affordable, accessible, and hassle-free for
                everyone. With just a few clicks, you can book your ride and enjoy the
                journey ahead with complete peace of mind and zero hidden costs.
              </p>
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: darkMode ? "#fff" : "#000", fontWeight: "500" }}>Coverage</span>
                  <span style={{ color: "#3b82f6", fontWeight: "700" }}>95%</span>
                </div>
                <ProgressBar theme={theme}>
                  <ProgressFill width="95%" />
                </ProgressBar>
                
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: darkMode ? "#fff" : "#000", fontWeight: "500" }}>Satisfaction</span>
                  <span style={{ color: "#28a745", fontWeight: "700" }}>98%</span>
                </div>
                <ProgressBar theme={theme}>
                  <ProgressFill width="98%" color="#28a745" />
                </ProgressBar>
              </div>
            </GlassCard>
          </div>
          
          <div className="col-lg-6">
            <GlassCard theme={theme} className="h-100">
              <div className="d-flex align-items-center mb-4">
                <IconContainer>
                  <i className="bi bi-eye fs-1"></i>
                </IconContainer>
                <SectionTitle theme={theme} className="mb-0">Our Vision</SectionTitle>
              </div>
              <p className="fs-5 mb-4" style={{ 
                color: darkMode ? "#fff" : "#000",
                lineHeight: "1.8",
                fontSize: "1.2rem"
              }}>
                We aim to be India's most trusted bus booking platform, connecting
                millions of travelers with seamless transportation solutions — one trip
                at a time, while innovating for a sustainable future.
              </p>
              <div>
                <TimelineItem theme={theme}>
                  <TimelineDot />
                  <TimelineText theme={theme}>2024: 500+ Cities Across India</TimelineText>
                </TimelineItem>
                <TimelineItem theme={theme}>
                  <TimelineDot />
                  <TimelineText theme={theme}>2025: 1000+ Routes & 5M Customers</TimelineText>
                </TimelineItem>
                <TimelineItem theme={theme}>
                  <TimelineDot />
                  <TimelineText theme={theme}>2026: International Expansion</TimelineText>
                </TimelineItem>
                <TimelineItem theme={theme}>
                  <TimelineDot />
                  <TimelineText theme={theme}>2027: 10M+ Happy Customers</TimelineText>
                </TimelineItem>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Team Section */}
        <GlassCard theme={theme} className="mb-5">
          <SectionTitle theme={theme} className="text-center">Our Leadership Team</SectionTitle>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 col-sm-12">
              <TeamCard theme={theme}>
                <TeamImage>
                  <img src={ceoimg} alt="CEO" />
                </TeamImage>
                <TeamName theme={theme}>Tirthankar Ghosh</TeamName>
                <TeamRole>CEO & Founder</TeamRole>
                <SocialLinks>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-envelope"></i></a>
                </SocialLinks>
              </TeamCard>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12">
              <TeamCard theme={theme}>
                <TeamImage>
                  <img src={ctoimg} alt="CTO" />
                </TeamImage>
                <TeamName theme={theme}>Richa Kumari</TeamName>
                <TeamRole>CTO</TeamRole>
                <SocialLinks>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-envelope"></i></a>
                </SocialLinks>
              </TeamCard>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-12">
              <TeamCard theme={theme}>
                <TeamImage>
                  <img src={cooimg} alt="COO" />
                </TeamImage>
                <TeamName theme={theme}>Shiranul Haque</TeamName>
                <TeamRole>COO</TeamRole>
                <SocialLinks>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-envelope"></i></a>
                </SocialLinks>
              </TeamCard>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12">
              <TeamCard theme={theme}>
                <TeamImage>
                  <img src={cfoimg} alt="CFO" />
                </TeamImage>
                <TeamName theme={theme}>Karma C. Bhutia</TeamName>
                <TeamRole>CFO</TeamRole>
                <SocialLinks>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-envelope"></i></a>
                </SocialLinks>
              </TeamCard>
            </div>
          </div>
        </GlassCard>

        {/* Testimonials */}
        <GlassCard theme={theme}>
          <SectionTitle theme={theme} className="text-center">What Our Customers Say</SectionTitle>
          <div className="row g-4">
            <div className="col-md-4">
              <TestimonialCard theme={theme}>
                <Stars>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </Stars>
                <TestimonialText theme={theme}>
                  "BookMyTrip made my journey so easy! Found the perfect bus in seconds and the booking was completely seamless. Will definitely use again!"
                </TestimonialText>
                <div>
                  <TestimonialAuthor theme={theme}>Rahul Sharma</TestimonialAuthor>
                  <TestimonialLocation>Mumbai</TestimonialLocation>
                </div>
              </TestimonialCard>
            </div>
            
            <div className="col-md-4">
              <TestimonialCard theme={theme}>
                <Stars>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </Stars>
                <TestimonialText theme={theme}>
                  "Great service! The real-time seat availability saved me from last-minute hassles during my trip to Delhi. Very reliable platform."
                </TestimonialText>
                <div>
                  <TestimonialAuthor theme={theme}>Priya Patel</TestimonialAuthor>
                  <TestimonialLocation>Delhi</TestimonialLocation>
                </div>
              </TestimonialCard>
            </div>
            
            <div className="col-md-4">
              <TestimonialCard theme={theme}>
                <Stars>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </Stars>
                <TestimonialText theme={theme}>
                  "The customer support is outstanding! They helped me rebook instantly when my plans changed unexpectedly. Highly recommended!"
                </TestimonialText>
                <div>
                  <TestimonialAuthor theme={theme}>Arun Kumar</TestimonialAuthor>
                  <TestimonialLocation>Bangalore</TestimonialLocation>
                </div>
              </TestimonialCard>
            </div>
          </div>
        </GlassCard>
      </ContentWrapper>

      <style jsx="true">{`
        .animate__fadeInDown {
          animation: fadeInDown 1s ease;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${darkMode ? "rgba(17, 25, 40, 0.5)" : "rgba(0, 0, 0, 0.05)"};
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.3)"};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </Container>
  );
}