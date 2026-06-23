const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const Bus = require("../models/Buses");
const Place = require("../models/Places");
const Hotel = require("../models/Hotels");
const Package = require("../models/Packages");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // 20 requests per IP
  message: {
    success: false,
    reply: "Too many requests. Please try again later.",
  },
});

router.post("/chat", aiLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    const places = await Place.find({
      status: "approved",
    }).select("name");

    const buses = await Bus.find({
      status: "approved",
    })
      .populate("source", "name")
      .populate("destination", "name")
      .select("name source destination");
    const hotels = await Hotel.find({
      status: "approved",
    })
      .populate("destination", "name")
      .select("name destination");

    const packages = await Package.find({
      status: "approved",
    })
      .populate("destination", "name")
      .select("title destination duration price");

    const placeList = places.map((p) => p.name).join(", ");

    const busList = buses
      .map((b) => `${b.name}: ${b.source?.name} → ${b.destination?.name}`)
      .join("\n");

    const hotelList = hotels
      .map((h) => `${h.name} - ${h.destination?.name}`)
      .join("\n");

    const packageList = packages
      .map((p) => `${p.title} - ${p.destination?.name} - ₹${p.price}`)
      .join("\n");

    // Direct BookMyTrip lookup before Gemini

    const foundPlaces = places.filter((p) =>
      lowerMessage.includes(p.name.toLowerCase()),
    );

    // Example:
    // "Do you have buses from Kolkata to Siliguri?"

    if (foundPlaces.length >= 2) {
      const sourcePlace = foundPlaces[0];
      const destinationPlace = foundPlaces[1];

      const matchedBuses = await Bus.find({
        status: "approved",
        source: sourcePlace._id,
        destination: destinationPlace._id,
      })
        .populate("source", "name")
        .populate("destination", "name");

      if (matchedBuses.length > 0) {
        return res.json({
          success: true,
          reply:
            `🚌 Available buses from ${sourcePlace.name} to ${destinationPlace.name}\n\n` +
            matchedBuses
              .map(
                (bus) =>
                  `• ${bus.name}\n⏰ ${bus.departureTime} → ${bus.arrivalTime}`,
              )
              .join("\n\n"),
        });
      }

      return res.json({
        success: true,
        reply: `❌ No approved buses found from ${sourcePlace.name} to ${destinationPlace.name}.`,
      });
    }

    if (
      (lowerMessage.includes("places") && lowerMessage.includes("available")) ||
      (lowerMessage.includes("destinations") &&
        (lowerMessage.includes("show") ||
          lowerMessage.includes("list") ||
          lowerMessage.includes("available")))
    ) {
      return res.json({
        success: true,
        reply:
          "📍 Available destinations on BookMyTrip:\n\n" +
          places.map((p) => `• ${p.name}`).join("\n"),
      });
    }

    if (lowerMessage.includes("hotel") || lowerMessage.includes("stay") || lowerMessage.includes("accommodation")) {
      const matchedHotels = hotels.filter((hotel) =>
        foundPlaces.some(
          (p) => p._id.toString() === hotel.destination?._id?.toString(),
        ),
      );

      if (matchedHotels.length > 0) {
        return res.json({
          success: true,
          reply:
            "🏨 Available Hotels:\n\n" +
            matchedHotels.map((h) => `• ${h.name}`).join("\n"),
        });
      }
    }
    if (lowerMessage.includes("package") || lowerMessage.includes("packages")) {
      const matchedPackages = packages.filter((pkg) =>
        foundPlaces.some(
          (p) => p._id.toString() === pkg.destination?._id?.toString(),
        ),
      );

      if (matchedPackages.length > 0) {
        return res.json({
          success: true,
          reply:
            "🎒 Available Packages:\n\n" +
            matchedPackages.map((p) => `• ${p.title} - ₹${p.price}`).join("\n"),
        });
      }
    }
    const prompt = `
    You are BookMyTrip AI Assistant.

    You are helping users on a bus booking platform.

    Approved Places:${placeList}

    Approved Buses:${busList}

    Approved Hotels:${hotelList}

    Approved Packages:${packageList}

    Rules:

    1. BookMyTrip approved places and buses are ONLY for answering availability questions.

    2. If the user asks:
    - Available destinations
    - Available places
    - Available buses
    - Bus routes
    - Hotels there
    - Packages
    Then use only the BookMyTrip data provided above.

    3. For travel recommendations, itineraries, tourist attractions, sightseeing, food, weather, culture, or trip planning, use your general travel knowledge and do NOT limit answers to BookMyTrip places.

    4. Use markdown formatting.

    5. Use emojis where appropriate.

    6. When recommending destinations include:
    - Top attractions
    - Best season to visit
    - Travel tips
    - Try to suggest top 2 packages if the destination is from approved places
  
    7. Keep replies under 250 words.

    8. If BookMyTrip does not serve a requested route, clearly mention that while still helping the user with travel information.

    User:
    ${message}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      reply: "Sorry, I couldn't process that request.",
    });
  }
});

module.exports = router;
