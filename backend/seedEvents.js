require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("./models/Event");

const events = [
  {
    title: "AI & Machine Learning Workshop",
    description:
      "Learn artificial intelligence, machine learning fundamentals, and practical AI applications from industry experts.",
    category: "Technology",
    location: "Lucknow, Uttar Pradesh",
    date: new Date("2027-03-10T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    price: 299,
    totalTickets: 100,
    availableTickets: 100,
  },
  {
    title: "Web Development Bootcamp",
    description:
      "Explore HTML, CSS, JavaScript, React, Node.js, and full-stack web development through practical sessions.",
    category: "Education",
    location: "Kanpur, Uttar Pradesh",
    date: new Date("2027-03-20T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    price: 199,
    totalTickets: 150,
    availableTickets: 150,
  },
  {
    title: "Startup Business Summit",
    description:
      "Meet entrepreneurs, discover startup opportunities, and learn about business strategies and fundraising.",
    category: "Business",
    location: "Noida, Uttar Pradesh",
    date: new Date("2027-04-05T11:00:00"),
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    price: 599,
    totalTickets: 200,
    availableTickets: 200,
  },
  {
    title: "Gaming Championship 2027",
    description:
      "Participate in an exciting gaming championship with competitive matches, prizes, and gaming enthusiasts.",
    category: "Gaming",
    location: "Lucknow, Uttar Pradesh",
    date: new Date("2027-04-15T12:00:00"),
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    price: 399,
    totalTickets: 100,
    availableTickets: 100,
  },
  {
    title: "Music Festival 2027",
    description:
      "Enjoy live performances, energetic music, and an unforgettable festival experience with fellow music lovers.",
    category: "Music",
    location: "Agra, Uttar Pradesh",
    date: new Date("2027-05-01T17:00:00"),
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    price: 799,
    totalTickets: 300,
    availableTickets: 300,
  },
  {
    title: "Photography Masterclass",
    description:
      "Improve your photography skills with practical lessons on composition, lighting, portraits, and editing.",
    category: "Art",
    location: "Varanasi, Uttar Pradesh",
    date: new Date("2027-05-12T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
    price: 249,
    totalTickets: 80,
    availableTickets: 80,
  },
  {
    title: "National Coding Hackathon",
    description:
      "Build innovative software solutions, collaborate with developers, and compete in a coding challenge.",
    category: "Technology",
    location: "Prayagraj, Uttar Pradesh",
    date: new Date("2027-06-01T09:00:00"),
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    price: 149,
    totalTickets: 120,
    availableTickets: 120,
  },
  {
    title: "Digital Marketing Conference",
    description:
      "Discover SEO, social media marketing, content strategy, analytics, and modern digital marketing techniques.",
    category: "Business",
    location: "Ghaziabad, Uttar Pradesh",
    date: new Date("2027-06-15T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    price: 349,
    totalTickets: 150,
    availableTickets: 150,
  },
  {
    title: "Robotics & Innovation Expo",
    description:
      "Explore robotics, automation, innovative engineering projects, and emerging technology demonstrations.",
    category: "Technology",
    location: "Lucknow, Uttar Pradesh",
    date: new Date("2027-07-05T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    price: 299,
    totalTickets: 100,
    availableTickets: 100,
  },
  {
    title: "Career & Internship Fair",
    description:
      "Explore career opportunities, connect with recruiters, and learn about internships and professional development.",
    category: "Career",
    location: "Noida, Uttar Pradesh",
    date: new Date("2027-07-20T10:00:00"),
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    price: 99,
    totalTickets: 250,
    availableTickets: 250,
  },
];

async function seedEvents() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the backend .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully.");

    let added = 0;
    let skipped = 0;

    for (const eventData of events) {
      const existingEvent = await Event.findOne({
        title: eventData.title,
      });

      if (existingEvent) {
        console.log(`Already exists, skipped: ${eventData.title}`);
        skipped++;
        continue;
      }

      await Event.create(eventData);

      console.log(`Event added: ${eventData.title}`);
      added++;
    }

    console.log("\n========== SUMMARY ==========");
    console.log(`New events added: ${added}`);
    console.log(`Existing events skipped: ${skipped}`);
    console.log("Seed operation completed successfully.");
  } catch (error) {
    console.error("Error adding events:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

seedEvents();